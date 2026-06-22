import { Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { SOS_API_URL } from '../config/api';
import { EmergencyContact } from '../context/AppContext';

export interface SOSResult {
  smsSent: boolean;
  emailSent: boolean;
  locationText: string | null;
  errors: string[];
}

async function getLocation(): Promise<{ url: string; text: string | null }> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return { url: 'Location unavailable (permission denied)', text: null };
  }
  try {
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const { latitude, longitude } = loc.coords;
    const text = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    const url = `https://maps.google.com/?q=${latitude},${longitude}`;
    return { url, text };
  } catch {
    return { url: 'Location unavailable', text: null };
  }
}

async function sendViaAPI(
  phones: string[],
  emails: string[],
  message: string,
  subject: string,
  senderName: string
): Promise<{ smsSent: boolean; emailSent: boolean; errors: string[] }> {
  try {
    const response = await fetch(SOS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phones, emails, message, subject, senderName }),
    });
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (err: any) {
    return { smsSent: false, emailSent: false, errors: [`API: ${err.message}`] };
  }
}

/**
 * Send SOS alert to all emergency contacts.
 * Returns the result with status of SMS/email sending.
 */
export async function triggerSOS(
  emergencyContacts: EmergencyContact[],
  profileName: string,
  showAlert: boolean = true
): Promise<SOSResult> {
  if (emergencyContacts.length === 0) {
    if (showAlert) {
      Alert.alert(
        'No Emergency Contacts',
        'Please add emergency contacts in your Profile before sending SOS.',
        [{ text: 'OK' }]
      );
    }
    return { smsSent: false, emailSent: false, locationText: null, errors: ['No emergency contacts'] };
  }

  const location = await getLocation();
  const senderName = profileName || 'Someone';
  const message = `EMERGENCY ALERT\n\n${senderName} needs help!\n\nLocation: ${location.url}\n\nPlease call or check on them immediately.\n\n— Sent via BridgeApp SOS`;
  const subject = `EMERGENCY: ${senderName} Needs Help`;

  const phones = emergencyContacts.map(c => c.phone).filter(Boolean);
  const emails = emergencyContacts.map(c => c.email).filter(Boolean);

  // Send via backend API (fully automatic)
  const apiResult = await sendViaAPI(phones, emails, message, subject, senderName);

  let smsSent = apiResult.smsSent;
  let emailSent = apiResult.emailSent;
  const errors = [...apiResult.errors];

  if (showAlert) {
    const statusLines: string[] = [];
    if (smsSent) statusLines.push('SMS sent automatically');
    if (emailSent) statusLines.push('Email sent automatically');
    if (location.text) statusLines.push(`Location: ${location.text}`);
    if (errors.length > 0) statusLines.push(`\nNotes:\n${errors.join('\n')}`);

    Alert.alert(
      smsSent || emailSent ? 'SOS Sent!' : 'SOS Issues',
      statusLines.join('\n') || 'Alert attempted.',
      [{ text: 'OK' }]
    );
  }

  return { smsSent, emailSent, locationText: location.text, errors };
}
