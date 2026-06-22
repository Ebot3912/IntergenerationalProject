import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  Animated, SafeAreaView, StatusBar, ScrollView, Platform,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';

import { SOS_API_URL } from '../config/api';

export default function SOSScreen() {
  const { emergencyContacts, profile } = useApp();
  const { t } = useLanguage();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [locationText, setLocationText] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [holdProgress] = useState(new Animated.Value(0));
  const holdAnim = useRef<Animated.CompositeAnimation | null>(null);

  // ─── Pulse animation ───────────────────────────────────────
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const getLocation = async (): Promise<{ url: string; text: string | null }> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { url: 'Location unavailable (permission denied)', text: null };
    }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = loc.coords;
      const text = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      setLocationText(text);
      return { url: `https://maps.google.com/?q=${latitude},${longitude}`, text };
    } catch {
      return { url: 'Location unavailable', text: null };
    }
  };

  // ─── Send via Backend API (fully automatic, zero clicks) ────
  const sendViaAPI = async (phones: string[], emails: string[], message: string, subject: string): Promise<{
    smsSent: boolean;
    emailSent: boolean;
    errors: string[];
  }> => {
    try {
      const response = await fetch(SOS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phones,
          emails,
          message,
          subject,
          senderName: profile.name || 'Someone',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.warn('API call failed:', err);
      return { smsSent: false, emailSent: false, errors: [`API: ${err.message}`] };
    }
  };

  // ─── Fallback: Send SMS via device (opens compose) ──────────
  const sendSMSFallback = async (phones: string[], message: string): Promise<boolean> => {
    try {
      const phoneList = phones.join(',');
      const smsBody = encodeURIComponent(message);
      const separator = Platform.OS === 'android' ? '?' : '&';
      const smsUrl = `sms:${phoneList}${separator}body=${smsBody}`;

      const canOpen = await Linking.canOpenURL(smsUrl);
      if (canOpen) {
        await Linking.openURL(smsUrl);
        return true;
      }

      // Try expo-sms as last resort
      const available = await SMS.isAvailableAsync();
      if (available) {
        await SMS.sendSMSAsync(phones, message);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  // ─── Fallback: Send Email via mailto (opens compose) ────────
  const sendEmailFallback = async (emails: string[], subject: string, message: string): Promise<boolean> => {
    try {
      const mailtoUrl = `mailto:${emails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      await Linking.openURL(mailtoUrl);
      return true;
    } catch {
      return false;
    }
  };

  // ─── Main SOS Send ─────────────────────────────────────────
  const sendSOS = async () => {
    if (emergencyContacts.length === 0) {
      Alert.alert(
        t('profile.emergencyContacts'),
        t('sos.noContactsMsg'),
        [{ text: 'OK' }]
      );
      return;
    }

    setSending(true);
    try {
      const location = await getLocation();
      const senderName = profile.name || 'Someone';
      const message = `EMERGENCY ALERT\n\n${senderName} needs help!\n\nLocation: ${location.url}\n\nPlease call or check on them immediately.\n\n— Sent via BridgeApp SOS`;
      const subject = `EMERGENCY: ${senderName} Needs Help`;

      const phones = emergencyContacts.map(c => c.phone).filter(Boolean);
      const emails = emergencyContacts.map(c => c.email).filter(Boolean);

      let smsSent = false;
      let emailSent = false;
      const errors: string[] = [];

      // ===== STEP 1: Try fully automatic sending via backend API =====
      const apiResult = await sendViaAPI(phones, emails, message, subject);

      smsSent = apiResult.smsSent;
      emailSent = apiResult.emailSent;

      // ===== STEP 2: Fallback to device-native methods if API failed =====
      if (!smsSent && phones.length > 0 && Platform.OS !== 'web') {
        // API SMS failed → fall back to opening Messages app
        const fallback = await sendSMSFallback(phones, message);
        if (fallback) {
          smsSent = true;
          errors.push('SMS: Opened in Messages (tap send to confirm)');
        } else {
          errors.push(...apiResult.errors.filter(e => e.startsWith('SMS')));
        }
      } else if (!smsSent && phones.length > 0) {
        errors.push(...apiResult.errors.filter(e => e.startsWith('SMS')));
      }

      if (!emailSent && emails.length > 0) {
        // API email failed → fall back to opening mail app
        const fallback = await sendEmailFallback(emails, subject, message);
        if (fallback) {
          emailSent = true;
          errors.push('Email: Opened in mail app (send manually)');
        } else {
          errors.push(...apiResult.errors.filter(e => e.startsWith('Email')));
        }
      }

      setSent(true);
      setSending(false);

      const statusLines: string[] = [];
      if (smsSent) statusLines.push('✅ SMS sent automatically');
      if (emailSent) statusLines.push('✅ Email sent automatically');
      if (location.text) statusLines.push(`📍 Location: ${location.text}`);
      if (errors.length > 0) statusLines.push(`\n⚠️ Notes:\n${errors.join('\n')}`);

      Alert.alert(
        emailSent || smsSent ? t('sos.sosSent') : t('sos.sosIssues'),
        statusLines.join('\n') || 'Alert attempted.',
        [{ text: 'OK', onPress: () => setTimeout(() => setSent(false), 3000) }]
      );
    } catch (err) {
      setSending(false);
      Alert.alert(t('common.error'), t('sos.sendErrorMsg'));
    }
  };

  const handleSOSPressIn = () => {
    holdAnim.current = Animated.timing(holdProgress, {
      toValue: 1, duration: 2000, useNativeDriver: false,
    });
    holdAnim.current.start(({ finished }) => {
      if (finished) sendSOS();
    });
  };

  const handleSOSPressOut = () => {
    holdAnim.current?.stop();
    Animated.timing(holdProgress, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const ringColor = holdProgress.interpolate({
    inputRange: [0, 1], outputRange: ['rgba(239,68,68,0.3)', 'rgba(239,68,68,0.9)'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0a0a" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="alert-circle" size={32} color={Colors.danger} />
          </View>
          <Text style={styles.headerTitle}>{t('sos.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('sos.subtitle')}
          </Text>
        </View>

        {/* SOS Button */}
        <View style={styles.sosSection}>
          <Animated.View style={[styles.outerRing, { backgroundColor: ringColor }]} />
          <Animated.View style={[styles.middleRing, { transform: [{ scale: pulseAnim }] }]} />
          <TouchableOpacity
            style={[styles.sosButton, sending && styles.sosSending, sent && styles.sosSent]}
            onPressIn={handleSOSPressIn}
            onPressOut={handleSOSPressOut}
            activeOpacity={0.85}
          >
            {sending ? (
              <>
                <Ionicons name="radio-outline" size={40} color={Colors.white} />
                <Text style={styles.sosButtonText}>{t('sos.sending')}</Text>
              </>
            ) : sent ? (
              <>
                <Ionicons name="checkmark-circle" size={40} color={Colors.white} />
                <Text style={styles.sosButtonText}>{t('sos.sent')}</Text>
              </>
            ) : (
              <>
                <Ionicons name="alert" size={48} color={Colors.white} />
                <Text style={styles.sosButtonText}>{t('sos.buttonText')}</Text>
                <Text style={styles.sosButtonHint}>{t('sos.holdHint')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Hold progress bar */}
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, {
            width: holdProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }]} />
        </View>
        <Text style={styles.progressHint}>{t('sos.holdToSend')}</Text>

        {/* Location Status */}
        {locationText && (
          <View style={styles.locationCard}>
            <Ionicons name="location" size={20} color={Colors.accentGreen} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>{t('sos.lastLocation')}</Text>
              <Text style={styles.locationText}>{locationText}</Text>
            </View>
          </View>
        )}

        {/* Contacts Summary */}
        <View style={styles.contactsCard}>
          <View style={styles.contactsHeader}>
            <Ionicons name="people" size={20} color={Colors.primary} />
            <Text style={styles.contactsTitle}>{t('sos.willAlert')}</Text>
            <View style={styles.contactsBadge}>
              <Text style={styles.contactsBadgeText}>{emergencyContacts.length}</Text>
            </View>
          </View>
          {emergencyContacts.length === 0 ? (
            <Text style={styles.noContactsText}>
              {t('sos.noContacts')}
            </Text>
          ) : (
            emergencyContacts.map(c => (
              <View key={c.id} style={styles.contactItem}>
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactAvatarText}>{c.name[0]?.toUpperCase()}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{c.name}</Text>
                  <Text style={styles.contactDetail}>{c.phone}{c.email ? ` • ${c.email}` : ''}</Text>
                </View>
                <View style={styles.alertMethods}>
                  {c.phone ? <Ionicons name="chatbubble" size={14} color={Colors.accentGreen} /> : null}
                  {c.email ? <Ionicons name="mail" size={14} color={Colors.accentBlue} /> : null}
                </View>
              </View>
            ))
          )}
        </View>

        {/* How It Works Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="flash" size={20} color={Colors.accent} />
            <Text style={styles.infoTitle}>{t('sos.fullyAutomatic')}</Text>
          </View>
          <Text style={styles.infoDesc}>
            {t('sos.automaticDesc')}
          </Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="chatbubble" size={16} color={Colors.accentGreen} />
              <Text style={styles.infoItemText}>{t('sos.smsViaTwilio')}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="mail" size={16} color={Colors.accentBlue} />
              <Text style={styles.infoItemText}>{t('sos.emailViaGmail')}</Text>
            </View>
          </View>
        </View>

        {/* Emergency Services */}
        <View style={styles.emergencyServicesCard}>
          <Text style={styles.emergencyServicesTitle}>{t('sos.emergencyServices')}</Text>
          <View style={styles.emergencyServicesRow}>
            <TouchableOpacity style={styles.emergencyServiceBtn} onPress={() => Linking.openURL('tel:911')}>
              <Ionicons name="call" size={22} color={Colors.white} />
              <Text style={styles.emergencyServiceBtnText}>{t('sos.call911')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.emergencyServiceBtn, styles.emergencyServiceBtnBlue]}
              onPress={() => Linking.openURL('tel:988')}>
              <Ionicons name="heart" size={22} color={Colors.white} />
              <Text style={styles.emergencyServiceBtnText}>{t('sos.crisis988')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1a0a0a' },
  container: { padding: Spacing.xl, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  headerIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.danger + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  headerTitle: { fontSize: FontSizes.xxxl, fontWeight: '800', color: Colors.white, marginBottom: 8 },
  headerSubtitle: { fontSize: FontSizes.md, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 22 },
  sosSection: { alignItems: 'center', justifyContent: 'center', height: 240, marginVertical: Spacing.xl },
  outerRing: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
  },
  middleRing: {
    position: 'absolute', width: 170, height: 170, borderRadius: 85,
    backgroundColor: Colors.danger + '30',
  },
  sosButton: {
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: Colors.danger,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.large,
    borderWidth: 4, borderColor: Colors.dangerDark,
  },
  sosSending: { backgroundColor: Colors.warning },
  sosSent: { backgroundColor: Colors.success },
  sosButtonText: {
    color: Colors.white, fontSize: FontSizes.xxl, fontWeight: '900',
    letterSpacing: 2, marginTop: 4,
  },
  sosButtonHint: { color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.xs, marginTop: 2 },
  progressBar: {
    height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3,
    marginHorizontal: 40, marginTop: Spacing.md, overflow: 'hidden',
  },
  progressFill: { height: 6, backgroundColor: Colors.danger, borderRadius: 3 },
  progressHint: {
    textAlign: 'center', color: 'rgba(255,255,255,0.5)',
    fontSize: FontSizes.sm, marginTop: 8, marginBottom: Spacing.xl,
  },
  locationCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.accentGreen + '15', borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.accentGreen + '30',
  },
  locationInfo: { flex: 1 },
  locationLabel: { fontSize: FontSizes.xs, color: Colors.accentGreen, fontWeight: '600', marginBottom: 2 },
  locationText: { fontSize: FontSizes.sm, color: Colors.white },
  contactsCard: {
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  contactsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md },
  contactsTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.white, flex: 1 },
  contactsBadge: {
    backgroundColor: Colors.primary, width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  contactsBadgeText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  noContactsText: { color: 'rgba(255,255,255,0.5)', fontSize: FontSizes.sm, lineHeight: 20 },
  contactItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  contactAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primary + '50', alignItems: 'center', justifyContent: 'center',
  },
  contactAvatarText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
  contactInfo: { flex: 1 },
  contactName: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.white },
  contactDetail: { fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  alertMethods: { flexDirection: 'row', gap: 6 },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.sm },
  infoTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.white, flex: 1 },
  infoDesc: { color: 'rgba(255,255,255,0.5)', fontSize: FontSizes.sm, lineHeight: 20, marginBottom: Spacing.md },
  infoRow: { flexDirection: 'row', gap: Spacing.lg },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoItemText: { color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm, fontWeight: '600' },
  emergencyServicesCard: {
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  emergencyServicesTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.white, marginBottom: Spacing.md },
  emergencyServicesRow: { flexDirection: 'row', gap: Spacing.md },
  emergencyServiceBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.danger, paddingVertical: 14, borderRadius: BorderRadius.lg,
  },
  emergencyServiceBtnBlue: { backgroundColor: Colors.accentBlue },
  emergencyServiceBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
});
