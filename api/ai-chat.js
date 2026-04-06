// Vercel serverless function — proxies chat to Claude API (raw HTTP)
const https = require('https');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, system } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const defaultSystem = `You are Compass AI, a friendly and helpful AI assistant for BridgeApp — an app connecting seniors and children across generations. You can help with ANYTHING: health & nutrition advice, exercise tips, technology help, daily planning, recipes (with full step-by-step instructions), conversation, answering questions, emotional support, history, science, games tips, and more. Keep responses warm, supportive, clear, and easy to understand for all ages. Respond in the same language the user writes in. Keep responses concise (under 250 words unless the user asks for detail or a full recipe). For medical advice, always recommend consulting a doctor.`;

  const body = JSON.stringify({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: system || defaultSystem,
    messages,
  });

  try {
    const reply = await new Promise((resolve, reject) => {
      const request = https.request({
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      }, (response) => {
        let data = '';
        response.on('data', chunk => { data += chunk; });
        response.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              reject(new Error(parsed.error.message || JSON.stringify(parsed.error)));
            } else {
              const text = (parsed.content || [])
                .filter(b => b.type === 'text')
                .map(b => b.text)
                .join('');
              resolve(text);
            }
          } catch (e) {
            reject(new Error('Failed to parse API response'));
          }
        });
      });
      request.on('error', reject);
      request.write(body);
      request.end();
    });

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('AI chat error:', err.message);
    return res.status(500).json({ error: 'Failed to get AI response', details: err.message });
  }
};
