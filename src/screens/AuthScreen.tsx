import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('auth.missingInfo'), t('auth.fillAllFields'));
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        Alert.alert(t('auth.missingName'), t('auth.enterNameMsg'));
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert(t('auth.passwordsDontMatch'), t('auth.passwordsDontMatchMsg'));
        return;
      }
      if (password.length < 6) {
        Alert.alert(t('auth.weakPassword'), t('auth.weakPasswordMsg'));
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, name.trim());
      }
    } catch (err: any) {
      let message = err?.message || 'Something went wrong';
      // Clean up Firebase error messages
      if (message.includes('auth/email-already-in-use')) {
        message = 'This email is already registered. Try logging in instead.';
      } else if (message.includes('auth/invalid-email')) {
        message = 'Please enter a valid email address.';
      } else if (message.includes('auth/wrong-password') || message.includes('auth/invalid-credential')) {
        message = 'Incorrect email or password.';
      } else if (message.includes('auth/user-not-found')) {
        message = 'No account found with this email. Try signing up.';
      } else if (message.includes('auth/too-many-requests')) {
        message = 'Too many attempts. Please try again later.';
      }
      Alert.alert(isLogin ? t('auth.loginFailed') : t('auth.signupFailed'), message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBridge}>
                <Ionicons name="people" size={40} color={Colors.white} />
              </View>
            </View>
            <Text style={styles.appName}>{t('auth.appName')}</Text>
            <Text style={styles.tagline}>{t('auth.tagline')}</Text>
          </View>

          {/* Auth Card */}
          <View style={styles.card}>
            {/* Tab Switcher */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.tabActive]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>{t('auth.login')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.tabActive]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>{t('auth.signup')}</Text>
              </TouchableOpacity>
            </View>

            {/* Name field (sign up only) */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('auth.fullName')}</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('auth.namePlaceholder')}
                    placeholderTextColor={Colors.textTertiary}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('auth.email')}</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.emailPlaceholder')}
                  placeholderTextColor={Colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('auth.password')}</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.passwordPlaceholder')}
                  placeholderTextColor={Colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password (sign up only) */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('auth.confirmPassword')}</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('auth.confirmPlaceholder')}
                    placeholderTextColor={Colors.textTertiary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Ionicons
                    name={isLogin ? 'log-in-outline' : 'person-add-outline'}
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={styles.submitBtnText}>
                    {isLogin ? t('auth.login') : t('auth.createAccount')}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Switch mode */}
            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => {
                setIsLogin(!isLogin);
                setPassword('');
                setConfirmPassword('');
              }}
            >
              <Text style={styles.switchText}>
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
              </Text>
              <Text style={styles.switchLink}>
                {isLogin ? t('auth.signup') : t('auth.login')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            {t('auth.secureFooter')}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1, justifyContent: 'center',
    padding: Spacing.xl, paddingVertical: 40,
  },
  header: { alignItems: 'center', marginBottom: 32 },
  logoContainer: { marginBottom: 16 },
  logoBridge: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.large,
  },
  appName: {
    fontSize: 32, fontWeight: '800', color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FontSizes.md, color: Colors.textSecondary,
    marginTop: 4, textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.xl, ...Shadow.medium,
  },
  tabRow: {
    flexDirection: 'row', backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg, padding: 4, marginBottom: Spacing.xl,
  },
  tab: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  inputGroup: { marginBottom: Spacing.lg },
  inputLabel: {
    fontSize: FontSizes.sm, fontWeight: '600',
    color: Colors.textPrimary, marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.background, borderRadius: BorderRadius.lg,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  input: {
    flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary,
    paddingVertical: 0,
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary, paddingVertical: 14,
    borderRadius: BorderRadius.lg, marginTop: Spacing.md,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: {
    color: Colors.white, fontSize: FontSizes.lg, fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row', justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  switchText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  switchLink: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '700' },
  footer: {
    textAlign: 'center', fontSize: FontSizes.xs, color: Colors.textTertiary,
    marginTop: 24, paddingHorizontal: 20,
  },
});
