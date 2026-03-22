import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useLanguage } from '../context/LanguageContext';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';

type SectionKey = 'profile' | 'sos' | 'schedule' | 'chat' | 'games' | 'voice' | 'account';

interface HelpSection {
  key: SectionKey;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color: string;
  steps: string[];
}

export default function HelpScreen() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<SectionKey | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const HELP_SECTIONS: HelpSection[] = [
    {
      key: 'profile',
      icon: 'person',
      title: t('help.sectionProfile'),
      color: Colors.primary,
      steps: [
        'Tap the "Profile" tab at the bottom of the screen.',
        'Tap "Edit" in the top right to change your info.',
        'Add your name, age, and a short bio.',
        'Tap your photo to take a new one or pick from your library.',
        'Choose if you are a "Senior" or "Youth".',
        'Tap "Save Profile" when you are done.',
      ],
    },
    {
      key: 'sos',
      icon: 'alert-circle',
      title: t('help.sectionSOS'),
      color: Colors.danger,
      steps: [
        'Tap the red "SOS" button in the center of the bottom bar.',
        'Make sure you have emergency contacts set up in your Profile.',
        'Press and HOLD the big red SOS button for 2 seconds.',
        'The app will automatically send a text message AND email to all your emergency contacts.',
        'The message includes your current location so they can find you.',
        'You do NOT need to type anything — it all happens automatically.',
      ],
    },
    {
      key: 'schedule',
      icon: 'calendar',
      title: t('help.sectionSchedule'),
      color: Colors.accentBlue,
      steps: [
        'Tap the "Schedule" tab at the bottom.',
        'You will see a calendar with your events.',
        'Tap the "+" button to add a new event.',
        'Enter the event name, date, and time.',
        'The app will send you a notification reminder before the event.',
        'Tap any event to see its details or delete it.',
      ],
    },
    {
      key: 'chat',
      icon: 'chatbubbles',
      title: t('help.sectionChat'),
      color: Colors.accentGreen,
      steps: [
        'Tap the "Chat" tab at the bottom.',
        'You will see a list of your friends.',
        'A green dot means they are online right now.',
        'Tap on a friend\'s name to open the conversation.',
        'Type your message at the bottom and tap Send.',
        'Messages are saved so you can read them later.',
      ],
    },
    {
      key: 'games',
      icon: 'game-controller',
      title: t('help.sectionGames'),
      color: Colors.accent,
      steps: [
        'Tap the "Games" tab at the bottom.',
        'Choose a game: Chess, Connect Four, Poker, Tic-Tac-Toe, Checkers, Word Search, or Trivia.',
        'Most games let you play against the computer (AI) or with a friend.',
        'Tap on any game card to start playing.',
        'Tap the back arrow to return to the game list.',
      ],
    },
    {
      key: 'voice',
      icon: 'mic',
      title: t('help.sectionVoice'),
      color: Colors.primaryDark,
      steps: [
        'Tap the microphone button (floating purple button) on any screen.',
        'Speak clearly and say a command like:',
        '"Send SOS" or "Help me" — IMMEDIATELY sends SOS to your emergency contacts!',
        '"Go to games" — opens the Games tab.',
        '"Go to chat" — opens the Chat tab.',
        '"Go to schedule" or "Go to calendar" — opens the Schedule tab.',
        '"Go to profile" — opens your Profile.',
        '"Play chess", "Play trivia" — opens a specific game.',
        '"Read help" — reads the help instructions aloud.',
        'Voice commands work best on web browsers (Chrome, Edge, Safari).',
      ],
    },
    {
      key: 'account',
      icon: 'key',
      title: t('help.sectionAccount'),
      color: Colors.textSecondary,
      steps: [
        'When you first open the app, you can sign up with your email and password.',
        'Your data is saved to the cloud — log in from any device to see your info.',
        'To log out, go to Profile and scroll down to the "Log Out" button.',
        'If you forget your password, contact the app administrator.',
      ],
    },
  ];

  const toggleSection = (key: SectionKey) => {
    setExpanded(expanded === key ? null : key);
  };

  const speakSection = async (section: HelpSection) => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    const text = `${section.title}. ${section.steps.join('. ')}`;
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.85,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const speakAll = async () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    const allText = HELP_SECTIONS.map(
      s => `${s.title}. ${s.steps.join('. ')}`
    ).join('. Next section. ');
    Speech.speak(`Here is how to use Bridge App. ${allText}`, {
      language: 'en-US',
      rate: 0.85,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('help.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('help.subtitle')}
          </Text>
        </View>

        {/* Read All Button */}
        <TouchableOpacity style={styles.readAllBtn} onPress={speakAll} activeOpacity={0.8}>
          <Ionicons
            name={speaking ? 'stop-circle' : 'volume-high'}
            size={22}
            color={Colors.white}
          />
          <Text style={styles.readAllText}>
            {speaking ? t('help.stopReading') : t('help.readAll')}
          </Text>
        </TouchableOpacity>

        {/* Help Sections */}
        {HELP_SECTIONS.map((section) => (
          <View key={section.key} style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.sectionIcon, { backgroundColor: section.color + '20' }]}>
                <Ionicons name={section.icon} size={24} color={section.color} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <TouchableOpacity
                onPress={() => speakSection(section)}
                style={styles.speakBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={speaking ? 'stop-circle-outline' : 'volume-medium-outline'}
                  size={20}
                  color={section.color}
                />
              </TouchableOpacity>
              <Ionicons
                name={expanded === section.key ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textLight}
              />
            </TouchableOpacity>

            {expanded === section.key && (
              <View style={styles.stepsContainer}>
                {section.steps.map((step, index) => (
                  <View key={index} style={styles.stepRow}>
                    <View style={[styles.stepNumber, { backgroundColor: section.color }]}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>{t('help.quickTips')}</Text>
          <Tip text={t('help.tip1')} />
          <Tip text={t('help.tip2')} />
          <Tip text={t('help.tip3')} />
          <Tip text={t('help.tip4')} />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <View style={styles.tipRow}>
      <Ionicons name="bulb" size={18} color={Colors.accent} />
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: FontSizes.md,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  readAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primaryDark,
    marginHorizontal: Spacing.xl,
    marginTop: -16,
    marginBottom: Spacing.lg,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    ...Shadow.medium,
  },
  readAllText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.white,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Shadow.small,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  speakBtn: {
    padding: 4,
  },
  stepsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  tipsCard: {
    backgroundColor: Colors.accent + '15',
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  tipsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 20,
  },
});
