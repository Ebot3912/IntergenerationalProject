import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, EmergencyContact } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';

const RELATION_KEYS = ['Family', 'Spouse', 'Parent', 'Sibling', 'Friend', 'Caregiver', 'Doctor', 'Other'];
const RELATION_COLORS: Record<string, string> = {
  Family: Colors.primary, Spouse: Colors.secondary, Parent: Colors.accentGreen,
  Sibling: Colors.accentBlue, Friend: Colors.accent, Caregiver: Colors.primaryLight,
  Doctor: Colors.danger, Other: Colors.textSecondary,
};

const emptyContact = (): EmergencyContact => ({
  id: Date.now().toString(),
  name: '', phone: '', email: '', relation: 'Family',
});

interface Props { onClose?: () => void; }

export default function EmergencyContactScreen({ onClose }: Props) {
  const { emergencyContacts, addEmergencyContact, updateEmergencyContact, removeEmergencyContact } = useApp();
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [form, setForm] = useState(emptyContact());

  const openAdd = () => {
    setEditingContact(null);
    setForm(emptyContact());
    setShowModal(true);
  };

  const openEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setForm({ ...contact });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      Alert.alert(t('common.required'), t('emergency.namePhoneRequired'));
      return;
    }
    if (editingContact) {
      await updateEmergencyContact(form);
    } else {
      await addEmergencyContact({ ...form, id: Date.now().toString() });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(t('emergency.removeContact'), t('emergency.removeConfirm', { name }), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => removeEmergencyContact(id) },
    ]);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const RELATION_LABELS: Record<string, string> = {
    Family: t('emergency.family'),
    Spouse: t('emergency.spouse'),
    Parent: t('emergency.parent'),
    Sibling: t('emergency.sibling'),
    Friend: t('emergency.friend'),
    Caregiver: t('emergency.caregiver'),
    Doctor: t('emergency.doctor'),
    Other: t('emergency.other'),
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.danger} />
      {/* Header */}
      <View style={styles.header}>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="shield-checkmark" size={28} color={Colors.white} />
          </View>
          <Text style={styles.headerTitle}>{t('emergency.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('emergency.subtitle')}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {emergencyContacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={72} color={Colors.border} />
            <Text style={styles.emptyTitle}>{t('emergency.noContacts')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('emergency.noContactsDesc')}
            </Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
              <Ionicons name="add-circle" size={20} color={Colors.white} />
              <Text style={styles.emptyAddBtnText}>{t('emergency.addFirst')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contactsList}>
            <Text style={styles.sectionTitle}>{emergencyContacts.length} {t('emergency.title')}</Text>
            {emergencyContacts.map((contact, index) => (
              <View key={contact.id} style={[styles.contactCard, index === 0 && styles.primaryContact]}>
                {index === 0 && (
                  <View style={styles.primaryBadge}>
                    <Ionicons name="star" size={10} color={Colors.white} />
                    <Text style={styles.primaryBadgeText}>{t('emergency.primary')}</Text>
                  </View>
                )}
                <View style={styles.contactRow}>
                  <View style={[styles.avatar, { backgroundColor: RELATION_COLORS[contact.relation] || Colors.primary }]}>
                    <Text style={styles.avatarText}>{getInitials(contact.name)}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <View style={styles.contactNameRow}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <View style={[styles.relationBadge, { backgroundColor: (RELATION_COLORS[contact.relation] || Colors.primary) + '20' }]}>
                        <Text style={[styles.relationText, { color: RELATION_COLORS[contact.relation] || Colors.primary }]}>
                          {RELATION_LABELS[contact.relation] || contact.relation}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.contactDetail}>
                      <Ionicons name="call-outline" size={13} color={Colors.textSecondary} />
                      <Text style={styles.contactDetailText}>{contact.phone}</Text>
                    </View>
                    {contact.email ? (
                      <View style={styles.contactDetail}>
                        <Ionicons name="mail-outline" size={13} color={Colors.textSecondary} />
                        <Text style={styles.contactDetailText}>{contact.email}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.contactActions}>
                    <TouchableOpacity style={styles.editActionBtn} onPress={() => openEdit(contact)}>
                      <Ionicons name="pencil" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteActionBtn} onPress={() => handleDelete(contact.id, contact.name)}>
                      <Ionicons name="trash" size={16} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            {t('emergency.infoText')}
          </Text>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="formSheet">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.modalCancel}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingContact ? t('emergency.editContact') : t('emergency.newContact')}</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.modalSave}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <ModalField
              label={t('emergency.fullName')} icon="person-outline"
              value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))}
              placeholder={t('emergency.namePlaceholder')}
            />
            <ModalField
              label={t('emergency.phone')} icon="call-outline"
              value={form.phone} onChangeText={v => setForm(f => ({ ...f, phone: v }))}
              placeholder={t('emergency.phonePlaceholder')} keyboardType="phone-pad"
            />
            <ModalField
              label={t('emergency.emailLabel')} icon="mail-outline"
              value={form.email} onChangeText={v => setForm(f => ({ ...f, email: v }))}
              placeholder={t('emergency.emailPlaceholder')} keyboardType="email-address"
            />

            <Text style={styles.modalLabel}>{t('emergency.relationship')}</Text>
            <View style={styles.relationGrid}>
              {RELATION_KEYS.map(rel => (
                <TouchableOpacity
                  key={rel}
                  style={[
                    styles.relationOption,
                    form.relation === rel && { backgroundColor: RELATION_COLORS[rel], borderColor: RELATION_COLORS[rel] },
                  ]}
                  onPress={() => setForm(f => ({ ...f, relation: rel }))}
                >
                  <Text style={[styles.relationOptionText, form.relation === rel && { color: Colors.white, fontWeight: '700' }]}>
                    {RELATION_LABELS[rel] || rel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function ModalField({ label, icon, value, onChangeText, placeholder, keyboardType }: any) {
  return (
    <View style={styles.mf}>
      <View style={styles.mfLabel}>
        <Ionicons name={icon} size={16} color={Colors.primary} />
        <Text style={styles.mfLabelText}>{label}</Text>
      </View>
      <TextInput
        style={styles.mfInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType ? 'none' : 'words'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.danger },
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.danger, paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md, paddingBottom: Spacing.xxxl,
    flexDirection: 'row', alignItems: 'flex-start',
  },
  backBtn: { padding: 4, marginTop: 4 },
  headerContent: { flex: 1, alignItems: 'center' },
  headerIcon: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  headerTitle: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.white },
  headerSubtitle: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  contactsList: { padding: Spacing.xl },
  sectionTitle: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.md },
  contactCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md, ...Shadow.small,
  },
  primaryContact: { borderWidth: 2, borderColor: Colors.danger + '40' },
  primaryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.danger, alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full, marginBottom: 10,
  },
  primaryBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  avatarText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.lg },
  contactInfo: { flex: 1 },
  contactNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  contactName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text },
  relationBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.full },
  relationText: { fontSize: 11, fontWeight: '600' },
  contactDetail: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  contactDetailText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  contactActions: { gap: 8 },
  editActionBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center',
  },
  deleteActionBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.danger + '15', alignItems: 'center', justifyContent: 'center',
  },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text, marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  emptyAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.danger, paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: BorderRadius.full, marginTop: 24, ...Shadow.small,
  },
  emptyAddBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
  infoBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: Colors.primary + '12', marginHorizontal: Spacing.xl,
    padding: Spacing.md, borderRadius: BorderRadius.lg, marginTop: 8,
  },
  infoText: { flex: 1, fontSize: FontSizes.sm, color: Colors.primary, lineHeight: 20 },
  modalSafe: { flex: 1, backgroundColor: Colors.white },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  modalCancel: { fontSize: FontSizes.md, color: Colors.textSecondary },
  modalSave: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.primary },
  modalBody: { padding: Spacing.xl },
  modalLabel: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 10, marginTop: Spacing.md },
  relationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  relationOption: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.full,
  },
  relationOptionText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary },
  mf: { marginBottom: Spacing.lg },
  mfLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  mfLabelText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary },
  mfInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontSize: FontSizes.md, color: Colors.text,
  },
});
