import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Image, Modal, SafeAreaView, StatusBar, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../utils/i18n';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';
import EmergencyContactScreen from './EmergencyContactScreen';

const ROLES = [
  { id: 'senior', label: 'Senior', icon: '👴', color: Colors.primary },
  { id: 'child', label: 'Child / Youth', icon: '👧', color: Colors.accentBlue },
];

export default function ProfileScreen() {
  const { profile, updateProfile } = useApp();
  const { user, logout } = useAuth();
  const { t, lang, setLanguage } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [showEmergency, setShowEmergency] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const pickImage = async (source: 'camera' | 'library') => {
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to take a photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, aspect: [1, 1], quality: 0.8,
      });
      if (!result.canceled) setForm(f => ({ ...f, photoUri: result.assets[0].uri }));
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library access is required.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true, aspect: [1, 1], quality: 0.8,
      });
      if (!result.canceled) setForm(f => ({ ...f, photoUri: result.assets[0].uri }));
    }
  };

  const handlePhotoPress = () => {
    Alert.alert(t('profile.changePhoto'), '', [
      { text: t('profile.camera'), onPress: () => pickImage('camera') },
      { text: t('profile.photoLibrary'), onPress: () => pickImage('library') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert(t('profile.nameRequired'), t('profile.nameRequiredMsg'));
      return;
    }
    await updateProfile(form);
    setEditing(false);
    Alert.alert(t('profile.saved'), t('profile.savedMsg'));
  };

  const handleCancel = () => {
    setForm({ ...profile });
    setEditing(false);
  };

  const displayProfile = editing ? form : profile;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBg} />
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>
          {!editing ? (
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
              <Ionicons name="pencil" size={18} color={Colors.white} />
              <Text style={styles.editBtnText}>{t('common.edit')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={editing ? handlePhotoPress : undefined}
            activeOpacity={editing ? 0.8 : 1}
          >
            {displayProfile.photoUri ? (
              <Image source={{ uri: displayProfile.photoUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={60} color={Colors.primaryLight} />
              </View>
            )}
            {editing && (
              <View style={styles.cameraOverlay}>
                <Ionicons name="camera" size={22} color={Colors.white} />
              </View>
            )}
          </TouchableOpacity>
          {!editing && displayProfile.name ? (
            <Text style={styles.avatarName}>{displayProfile.name}</Text>
          ) : null}
          {!editing && displayProfile.role ? (
            <View style={[styles.roleBadge, { backgroundColor: displayProfile.role === 'senior' ? Colors.primary : Colors.accentBlue }]}>
              <Text style={styles.roleBadgeText}>
                {displayProfile.role === 'senior' ? `👴 ${t('profile.senior')}` : `👧 ${t('profile.youth')}`}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Form / Info */}
        <View style={styles.card}>
          <Field
            label={t('profile.fullName')}
            icon="person-outline"
            value={displayProfile.name}
            editing={editing}
            onChangeText={v => setForm(f => ({ ...f, name: v }))}
            placeholder={t('profile.namePlaceholder')}
          />
          <Field
            label={t('profile.age')}
            icon="calendar-outline"
            value={displayProfile.age}
            editing={editing}
            onChangeText={v => setForm(f => ({ ...f, age: v }))}
            placeholder={t('profile.agePlaceholder')}
            keyboardType="numeric"
          />
          <Field
            label={t('profile.bio')}
            icon="chatbubble-outline"
            value={displayProfile.bio}
            editing={editing}
            onChangeText={v => setForm(f => ({ ...f, bio: v }))}
            placeholder={t('profile.bioPlaceholder')}
            multiline
          />

          {/* Role Selector */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldLabel}>
              <Ionicons name="people-outline" size={18} color={Colors.primary} />
              <Text style={styles.fieldLabelText}>{t('profile.iAmA')}</Text>
            </View>
            <View style={styles.roleRow}>
              {ROLES.map(role => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleOption,
                    displayProfile.role === role.id && { borderColor: role.color, backgroundColor: role.color + '15' },
                    !editing && styles.roleOptionDisabled,
                  ]}
                  onPress={editing ? () => setForm(f => ({ ...f, role: role.id as any })) : undefined}
                  activeOpacity={editing ? 0.7 : 1}
                >
                  <Text style={styles.roleEmoji}>{role.icon}</Text>
                  <Text style={[styles.roleLabel, displayProfile.role === role.id && { color: role.color, fontWeight: '700' }]}>
                    {role.id === 'senior' ? t('profile.senior') : t('profile.youth')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {editing && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
            <Text style={styles.saveBtnText}>{t('profile.saveProfile')}</Text>
          </TouchableOpacity>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>{t('profile.quickActions')}</Text>
          <QuickAction
            icon="shield-checkmark"
            iconColor={Colors.danger}
            label={t('profile.emergencyContacts')}
            subtitle={t('profile.emergencyContactsSub')}
            onPress={() => setShowEmergency(true)}
          />
          <QuickAction
            icon="trophy"
            iconColor={Colors.accent}
            label={t('profile.gameStats')}
            subtitle={t('profile.gameStatsSub')}
            onPress={() => Alert.alert(t('common.comingSoon'), '')}
          />
          <QuickAction
            icon="language"
            iconColor={Colors.accentBlue}
            label={t('profile.language')}
            subtitle={t('profile.languageSub')}
            onPress={() => setShowLangModal(true)}
          />
          <QuickAction
            icon="settings"
            iconColor={Colors.textSecondary}
            label={t('profile.settings')}
            subtitle={t('profile.settingsSub')}
            onPress={() => Alert.alert(t('profile.settings'), '')}
          />
        </View>

        {/* Account Info & Logout */}
        {user && (
          <View style={styles.accountCard}>
            <View style={styles.accountRow}>
              <Ionicons name="mail-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.accountEmail}>{user.email || 'Signed in'}</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                Alert.alert(t('profile.logOut'), t('profile.logOutMsg'), [
                  { text: t('common.cancel'), style: 'cancel' },
                  { text: t('profile.logOut'), style: 'destructive', onPress: logout },
                ]);
              }}
            >
              <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
              <Text style={styles.logoutBtnText}>{t('profile.logOut')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={showEmergency} animationType="slide" presentationStyle="pageSheet">
        <EmergencyContactScreen onClose={() => setShowEmergency(false)} />
      </Modal>

      <Modal visible={showLangModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.text }}>{t('profile.language')}</Text>
            <TouchableOpacity onPress={() => setShowLangModal(false)}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {SUPPORTED_LANGUAGES.map((langOpt) => (
              <TouchableOpacity
                key={langOpt.code}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 16, marginHorizontal: 16, marginTop: 8, borderRadius: 12, backgroundColor: lang === langOpt.code ? Colors.primary + '15' : Colors.white, borderWidth: lang === langOpt.code ? 2 : 1, borderColor: lang === langOpt.code ? Colors.primary : Colors.border }}
                onPress={() => { setLanguage(langOpt.code); setShowLangModal(false); }}
              >
                <Text style={{ fontSize: 24, marginRight: 12 }}>{langOpt.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text }}>{langOpt.nativeLabel}</Text>
                  <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 2 }}>{langOpt.label}</Text>
                </View>
                {lang === langOpt.code && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
              </TouchableOpacity>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function Field({
  label, icon, value, editing, onChangeText, placeholder, multiline, keyboardType,
}: any) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldLabel}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
        <Text style={styles.fieldLabelText}>{label}</Text>
      </View>
      {editing ? (
        <TextInput
          style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          multiline={multiline}
          keyboardType={keyboardType}
          numberOfLines={multiline ? 3 : 1}
        />
      ) : (
        <Text style={[styles.fieldValue, !value && styles.fieldValueEmpty]}>
          {value || placeholder}
        </Text>
      )}
    </View>
  );
}

function QuickAction({ icon, iconColor, label, subtitle, onPress }: any) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.quickActionIcon, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.quickActionText}>
        <Text style={styles.quickActionLabel}>{label}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBg: { position: 'absolute' },
  headerTitle: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.white },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: BorderRadius.full,
  },
  editBtnText: { color: Colors.white, fontWeight: '600', fontSize: FontSizes.sm },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: BorderRadius.full,
  },
  cancelBtnText: { color: Colors.white, fontWeight: '600', fontSize: FontSizes.sm },
  avatarSection: {
    alignItems: 'center', marginTop: -50,
    marginBottom: Spacing.xl,
  },
  avatarWrapper: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.white,
    ...Shadow.medium,
    borderWidth: 4, borderColor: Colors.white,
  },
  avatar: { width: 92, height: 92, borderRadius: 46 },
  avatarPlaceholder: {
    width: 92, height: 92, borderRadius: 46,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  cameraOverlay: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: Colors.primary,
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  avatarName: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text, marginTop: Spacing.sm },
  roleBadge: {
    marginTop: 6, paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  roleBadgeText: { color: Colors.white, fontWeight: '600', fontSize: FontSizes.sm },
  card: {
    backgroundColor: Colors.white, marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl, padding: Spacing.xl,
    ...Shadow.small, marginBottom: Spacing.lg,
  },
  fieldContainer: { marginBottom: Spacing.lg },
  fieldLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  fieldLabelText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary },
  fieldInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    fontSize: FontSizes.md, color: Colors.text, backgroundColor: Colors.background,
  },
  fieldInputMultiline: { height: 80, textAlignVertical: 'top', paddingTop: 10 },
  fieldValue: { fontSize: FontSizes.md, color: Colors.text, fontWeight: '500' },
  fieldValueEmpty: { color: Colors.textLight, fontStyle: 'italic' },
  roleRow: { flexDirection: 'row', gap: Spacing.md },
  roleOption: {
    flex: 1, alignItems: 'center', padding: Spacing.md,
    borderWidth: 2, borderColor: Colors.border, borderRadius: BorderRadius.lg,
  },
  roleOptionDisabled: { opacity: 0.7 },
  roleEmoji: { fontSize: 28, marginBottom: 4 },
  roleLabel: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, marginHorizontal: Spacing.xl,
    paddingVertical: 15, borderRadius: BorderRadius.xl,
    ...Shadow.medium, marginBottom: Spacing.xl,
  },
  saveBtnText: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.white },
  actionsCard: {
    backgroundColor: Colors.white, marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl, padding: Spacing.xl,
    ...Shadow.small,
  },
  actionsTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  quickAction: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  quickActionIcon: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  quickActionText: { flex: 1 },
  quickActionLabel: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.text },
  quickActionSubtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
  accountCard: {
    backgroundColor: Colors.white, marginHorizontal: Spacing.xl, marginTop: Spacing.lg,
    borderRadius: BorderRadius.xl, padding: Spacing.xl,
    ...Shadow.small,
  },
  accountRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: Spacing.md, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  accountEmail: { fontSize: FontSizes.sm, color: Colors.textSecondary, flex: 1 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: BorderRadius.lg,
    borderWidth: 1.5, borderColor: Colors.danger + '40',
    backgroundColor: Colors.danger + '08',
  },
  logoutBtnText: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.danger },
});
