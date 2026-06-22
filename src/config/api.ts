export const SOS_API_URL = __DEV__
  ? 'http://localhost:3000/api/send-sos'  // local dev (won't work on physical device)
  : 'https://bridgeapp-sos.vercel.app/api/send-sos';
