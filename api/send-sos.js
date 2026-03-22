// Vercel Serverless Function: /api/send-sos
// Handles fully automatic SMS (Twilio) and Email (Gmail SMTP) sending

const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phones, emails, message, subject, senderName } = req.body;

  const results = { smsSent: false, emailSent: false, errors: [] };

  // ═══════════════════════════════════════════════════════════════
  // 1. SEND EMAIL via Gmail SMTP (Nodemailer + App Password)
  // ═══════════════════════════════════════════════════════════════
  if (emails && emails.length > 0) {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailAppPassword) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailAppPassword,
          },
        });

        for (const email of emails) {
          try {
            await transporter.sendMail({
              from: `"BridgeApp SOS" <${gmailUser}>`,
              to: email,
              subject: subject || `EMERGENCY: ${senderName || 'Someone'} Needs Help`,
              text: message,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: #EF4444; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">🚨 EMERGENCY ALERT</h1>
                  </div>
                  <div style="background: #FEF2F2; padding: 24px; border: 2px solid #FECACA; border-radius: 0 0 12px 12px;">
                    <p style="font-size: 18px; color: #991B1B; font-weight: bold; margin-top: 0;">
                      ${senderName || 'Someone'} needs help!
                    </p>
                    <p style="font-size: 15px; color: #333; white-space: pre-line;">${message}</p>
                    <hr style="border: none; border-top: 1px solid #FECACA; margin: 16px 0;" />
                    <p style="font-size: 12px; color: #999; margin-bottom: 0;">
                      Sent via BridgeApp Emergency SOS
                    </p>
                  </div>
                </div>
              `,
            });
            console.log(`Email sent to ${email}`);
          } catch (emailErr) {
            console.error(`Email to ${email} failed:`, emailErr.message);
            results.errors.push(`Email to ${email}: ${emailErr.message}`);
          }
        }
        results.emailSent = true;
      } catch (err) {
        console.error('Gmail transporter error:', err.message);
        results.errors.push(`Email setup failed: ${err.message}`);
      }
    } else {
      results.errors.push('Email: Gmail credentials not configured on server');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. SEND SMS via Twilio (fully automatic, no user interaction)
  // ═══════════════════════════════════════════════════════════════
  if (phones && phones.length > 0) {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (twilioSid && twilioAuth && twilioPhone) {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');

      for (const phone of phones) {
        try {
          // Normalize phone number — add +1 if it's a US number without country code
          let toPhone = phone.replace(/[\s\-\(\)]/g, '');
          if (!toPhone.startsWith('+')) {
            toPhone = '+1' + toPhone;
          }

          const body = new URLSearchParams({
            To: toPhone,
            From: twilioPhone,
            Body: message,
          });

          const twilioRes = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
          });

          if (twilioRes.ok) {
            console.log(`SMS sent to ${phone}`);
            results.smsSent = true;
          } else {
            const errData = await twilioRes.json();
            console.error(`SMS to ${phone} failed:`, errData.message);
            results.errors.push(`SMS to ${phone}: ${errData.message}`);
          }
        } catch (smsErr) {
          console.error(`SMS to ${phone} error:`, smsErr.message);
          results.errors.push(`SMS to ${phone}: ${smsErr.message}`);
        }
      }
    } else {
      results.errors.push('SMS: Twilio credentials not configured on server');
    }
  }

  const success = results.smsSent || results.emailSent;
  return res.status(success ? 200 : 500).json(results);
};
