import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, SafeAreaView, StatusBar, Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { useApp, ScheduleEvent } from '../context/AppContext';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const EVENT_COLORS = [
  Colors.primary, Colors.secondary, Colors.accentGreen,
  Colors.accentBlue, Colors.accent, Colors.warning,
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDisplayDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const emptyEvent = (): ScheduleEvent => ({
  id: Date.now().toString(),
  title: '', date: formatDate(new Date()),
  time: '10:00 AM', description: '', color: Colors.primary,
});

export default function ScheduleScreen() {
  const { t } = useLanguage();
  const { scheduleEvents, addScheduleEvent, updateScheduleEvent, removeScheduleEvent } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [form, setForm] = useState(emptyEvent());

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Notifications', 'Enable notifications to get event reminders.');
    }
  };

  const scheduleNotification = async (event: ScheduleEvent): Promise<string | undefined> => {
    try {
      const [y, m, d] = event.date.split('-').map(Number);
      const [timePart, ampm] = event.time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const eventDate = new Date(y, m - 1, d, hours, minutes);
      const triggerDate = new Date(eventDate.getTime() - 15 * 60 * 1000); // 15 min before

      if (triggerDate <= new Date()) return undefined;

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ Upcoming: ${event.title}`,
          body: `Starting in 15 minutes${event.description ? ` • ${event.description}` : ''}`,
          data: { eventId: event.id },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
      });
      return id;
    } catch { return undefined; }
  };

  const openAdd = () => {
    setEditingEvent(null);
    setForm({ ...emptyEvent(), date: selectedDate });
    setShowModal(true);
  };

  const openEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setForm({ ...event });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert(t('common.required'), t('schedule.titleRequired'));
      return;
    }
    const notificationId = await scheduleNotification(form);
    const eventToSave = { ...form, notificationId };

    if (editingEvent) {
      if (editingEvent.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(editingEvent.notificationId).catch(() => {});
      }
      await updateScheduleEvent(eventToSave);
    } else {
      await addScheduleEvent({ ...eventToSave, id: Date.now().toString() });
    }
    setShowModal(false);
    Alert.alert(t('schedule.saved'), notificationId ? 'Event saved! You\'ll be reminded 15 min before.' : 'Event saved!');
  };

  const handleDelete = (event: ScheduleEvent) => {
    Alert.alert(t('schedule.deleteEvent'), `Delete "${event.title}"?`, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'), style: 'destructive',
        onPress: async () => {
          if (event.notificationId) {
            await Notifications.cancelScheduledNotificationAsync(event.notificationId).catch(() => {});
          }
          await removeScheduleEvent(event.id);
        },
      },
    ]);
  };

  // Calendar helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = formatDate(new Date());

  const eventsByDate: Record<string, ScheduleEvent[]> = {};
  scheduleEvents.forEach(e => {
    if (!eventsByDate[e.date]) eventsByDate[e.date] = [];
    eventsByDate[e.date].push(e);
  });

  const selectedEvents = eventsByDate[selectedDate] || [];
  const upcomingEvents = scheduleEvents
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('schedule.title')}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          {/* Month Navigation */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {DAYS.map(d => (
              <Text key={d} style={styles.dayHeader}>{d}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {Array.from({ length: firstDay }, (_, i) => (
              <View key={`empty-${i}`} style={styles.dayCell} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === today;
              const isSelected = dateStr === selectedDate;
              const dayEvents = eventsByDate[dateStr] || [];
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayCell, isSelected && styles.selectedDay, isToday && !isSelected && styles.todayDay]}
                  onPress={() => setSelectedDate(dateStr)}
                >
                  <Text style={[styles.dayNum, isSelected && styles.selectedDayNum, isToday && !isSelected && styles.todayDayNum]}>
                    {day}
                  </Text>
                  {dayEvents.length > 0 && (
                    <View style={styles.eventDots}>
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <View key={idx} style={[styles.eventDot, { backgroundColor: e.color }]} />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedDate === today ? t('schedule.todayEvents') : formatDisplayDate(selectedDate)}
            </Text>
            <TouchableOpacity style={styles.addEventBtn} onPress={openAdd}>
              <Ionicons name="add-circle" size={20} color={Colors.primary} />
              <Text style={styles.addEventBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {selectedEvents.length === 0 ? (
            <View style={styles.emptyDay}>
              <Ionicons name="calendar-outline" size={40} color={Colors.border} />
              <Text style={styles.emptyDayText}>{t('schedule.noEvents')}</Text>
            </View>
          ) : (
            selectedEvents.map(event => (
              <EventCard key={event.id} event={event} onEdit={() => openEdit(event)} onDelete={() => handleDelete(event)} />
            ))
          )}
        </View>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('schedule.upcoming')}</Text>
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} compact onEdit={() => openEdit(event)} onDelete={() => handleDelete(event)} />
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="formSheet">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.modalCancel}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingEvent ? t('schedule.editEvent') : t('schedule.newEvent')}</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.modalSave}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <MField label={t('schedule.eventTitle')} icon="bookmark-outline"
              value={form.title} onChangeText={v => setForm(f => ({ ...f, title: v }))} placeholder={t('schedule.eventTitlePlaceholder')} />
            <MField label={t('schedule.date')} icon="calendar-outline"
              value={form.date} onChangeText={v => setForm(f => ({ ...f, date: v }))} placeholder={t('schedule.datePlaceholder')} />
            <MField label={t('schedule.time')} icon="time-outline"
              value={form.time} onChangeText={v => setForm(f => ({ ...f, time: v }))} placeholder={t('schedule.timePlaceholder')} />
            <MField label={t('schedule.description')} icon="document-text-outline"
              value={form.description} onChangeText={v => setForm(f => ({ ...f, description: v }))}
              placeholder={t('schedule.descPlaceholder')} multiline />

            <Text style={styles.colorLabel}>{t('schedule.eventColor')}</Text>
            <View style={styles.colorRow}>
              {EVENT_COLORS.map(c => (
                <TouchableOpacity
                  key={c} style={[styles.colorOption, { backgroundColor: c },
                  form.color === c && styles.colorSelected]}
                  onPress={() => setForm(f => ({ ...f, color: c }))}
                >
                  {form.color === c && <Ionicons name="checkmark" size={16} color={Colors.white} />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.reminderNote}>
              <Ionicons name="notifications" size={16} color={Colors.primary} />
              <Text style={styles.reminderNoteText}>{t('schedule.reminderNote')}</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function EventCard({ event, compact, onEdit, onDelete }: { event: ScheduleEvent; compact?: boolean; onEdit: () => void; onDelete: () => void }) {
  return (
    <View style={[styles.eventCard, compact && styles.eventCardCompact, { borderLeftColor: event.color }]}>
      <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={[styles.eventTitle, compact && styles.eventTitleCompact]} numberOfLines={1}>{event.title}</Text>
          {!compact && (
            <View style={styles.eventActions}>
              <TouchableOpacity onPress={onEdit} style={styles.eventActionBtn}>
                <Ionicons name="pencil" size={14} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} style={styles.eventDeleteBtn}>
                <Ionicons name="trash" size={14} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.eventMeta}>
          <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.eventTime}>{event.time}</Text>
          {compact && <Text style={styles.eventDate}> • {formatDisplayDate(event.date)}</Text>}
        </View>
        {!compact && event.description ? (
          <Text style={styles.eventDesc} numberOfLines={2}>{event.description}</Text>
        ) : null}
      </View>
    </View>
  );
}

function MField({ label, icon, value, onChangeText, placeholder, multiline, keyboardType }: any) {
  return (
    <View style={styles.mf}>
      <View style={styles.mfLabel}>
        <Ionicons name={icon} size={16} color={Colors.primary} />
        <Text style={styles.mfLabelText}>{label}</Text>
      </View>
      <TextInput
        style={[styles.mfInput, multiline && styles.mfInputMultiline]}
        value={value} onChangeText={onChangeText}
        placeholder={placeholder} placeholderTextColor={Colors.textLight}
        multiline={multiline} numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSizes.xxxl, fontWeight: '800', color: Colors.text },
  addBtn: {
    backgroundColor: Colors.primary, width: 40, height: 40,
    borderRadius: 20, alignItems: 'center', justifyContent: 'center', ...Shadow.small,
  },
  calendarCard: {
    backgroundColor: Colors.white, marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadow.small, marginBottom: Spacing.lg,
  },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  navBtn: { padding: 8 },
  monthTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text },
  dayHeaders: { flexDirection: 'row', marginBottom: 8 },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: FontSizes.xs, fontWeight: '600', color: Colors.textSecondary },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', padding: 2 },
  selectedDay: { backgroundColor: Colors.primary, borderRadius: 10 },
  todayDay: { borderWidth: 2, borderColor: Colors.primary, borderRadius: 10 },
  dayNum: { fontSize: FontSizes.sm, fontWeight: '500', color: Colors.text },
  selectedDayNum: { color: Colors.white, fontWeight: '700' },
  todayDayNum: { color: Colors.primary, fontWeight: '700' },
  eventDots: { flexDirection: 'row', gap: 2, marginTop: 1 },
  eventDot: { width: 4, height: 4, borderRadius: 2 },
  section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  addEventBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addEventBtnText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.primary },
  emptyDay: { alignItems: 'center', padding: Spacing.xl, backgroundColor: Colors.white, borderRadius: BorderRadius.lg },
  emptyDayText: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: 8 },
  eventCard: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm, overflow: 'hidden', ...Shadow.small, borderLeftWidth: 4,
  },
  eventCardCompact: { marginBottom: 6 },
  eventColorBar: { width: 4 },
  eventContent: { flex: 1, padding: Spacing.md },
  eventHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  eventTitle: { flex: 1, fontSize: FontSizes.md, fontWeight: '700', color: Colors.text },
  eventTitleCompact: { fontSize: FontSizes.sm },
  eventActions: { flexDirection: 'row', gap: 8 },
  eventActionBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center',
  },
  eventDeleteBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.danger + '15', alignItems: 'center', justifyContent: 'center',
  },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventTime: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  eventDate: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  eventDesc: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
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
  colorLabel: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 10, marginTop: Spacing.md },
  colorRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  colorOption: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  colorSelected: { borderWidth: 3, borderColor: Colors.white, ...Shadow.small },
  reminderNote: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary + '12', padding: Spacing.md, borderRadius: BorderRadius.md,
  },
  reminderNoteText: { flex: 1, fontSize: FontSizes.sm, color: Colors.primary },
  mf: { marginBottom: Spacing.lg },
  mfLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  mfLabelText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary },
  mfInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontSize: FontSizes.md, color: Colors.text,
  },
  mfInputMultiline: { height: 80, textAlignVertical: 'top', paddingTop: 10 },
});
