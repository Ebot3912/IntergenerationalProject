import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';

export default function GamesScreen({ navigation }: any) {
  const { t } = useLanguage();

  const GAMES = [
    {
      id: 'Chess',
      name: t('games.chess'),
      emoji: '♟️',
      description: t('games.chessDesc'),
      players: '2 ' + t('games.players'),
      difficulty: t('games.strategy'),
      color: '#1A1A2E',
      accentColor: '#F0D9B5',
      tags: [t('games.strategy'), t('games.classic')],
      featured: true,
    },
    {
      id: 'ConnectFour',
      name: t('games.connectFour'),
      emoji: '🔴',
      description: t('games.connectFourDesc'),
      players: '2 ' + t('games.players'),
      difficulty: t('games.easy'),
      color: '#1B4332',
      accentColor: Colors.connectFourYellow,
      tags: [t('games.fun'), t('games.quick')],
      featured: false,
    },
    {
      id: 'Poker',
      name: t('games.poker'),
      emoji: '🃏',
      description: t('games.pokerDesc'),
      players: '2-6 ' + t('games.players'),
      difficulty: t('games.medium'),
      color: '#1B2A4F',
      accentColor: Colors.accent,
      tags: [t('games.cards'), t('games.bluffing')],
      featured: false,
    },
  ];

  const QUICK_GAMES = [
    { name: t('games.ticTacToe'), emoji: '⭕', color: Colors.primary, route: 'TicTacToe' },
    { name: t('games.checkers'), emoji: '🔲', color: Colors.accentBlue, route: 'Checkers' },
    { name: t('games.wordSearch'), emoji: '🔤', color: Colors.accentGreen, route: 'WordSearch' },
    { name: t('games.trivia'), emoji: '🧠', color: Colors.warning, route: 'Trivia' },
  ];
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{t('games.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('games.subtitle')}</Text>
          </View>
          <View style={styles.headerEmoji}>
            <Text style={{ fontSize: 32 }}>🎮</Text>
          </View>
        </View>

        {/* Featured / Main Games */}
        <Text style={styles.sectionTitle}>{t('games.featured')}</Text>
        {GAMES.map(game => (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, { backgroundColor: game.color }]}
            onPress={() => navigation.navigate(game.id)}
            activeOpacity={0.85}
          >
            {/* Decorative circles */}
            <View style={[styles.decorCircle1, { backgroundColor: game.accentColor + '20' }]} />
            <View style={[styles.decorCircle2, { backgroundColor: game.accentColor + '10' }]} />

            <View style={styles.gameCardContent}>
              <View style={styles.gameCardLeft}>
                <View style={[styles.gameEmojiContainer, { backgroundColor: game.accentColor + '25' }]}>
                  <Text style={styles.gameEmoji}>{game.emoji}</Text>
                </View>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <Text style={styles.gameDesc} numberOfLines={2}>{game.description}</Text>
                  <View style={styles.gameTags}>
                    {game.tags.map(tag => (
                      <View key={tag} style={[styles.gameTag, { backgroundColor: game.accentColor + '30' }]}>
                        <Text style={[styles.gameTagText, { color: game.accentColor }]}>{tag}</Text>
                      </View>
                    ))}
                    <View style={[styles.gameTag, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                      <Ionicons name="people" size={10} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.gameTagTextLight}>{game.players}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.playBtn, { backgroundColor: game.accentColor }]}
                onPress={() => navigation.navigate(game.id)}
              >
                <Ionicons name="play" size={18} color={game.color} />
                <Text style={[styles.playBtnText, { color: game.color }]}>Play</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* More Games */}
        <Text style={styles.sectionTitle}>{t('games.moreGames')}</Text>
        <View style={styles.quickGamesGrid}>
          {QUICK_GAMES.map(game => (
            <TouchableOpacity
              key={game.name}
              style={[styles.quickGameCard, { backgroundColor: game.color + '15', borderColor: game.color + '30' }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(game.route)}
            >
              <Text style={styles.quickGameEmoji}>{game.emoji}</Text>
              <Text style={[styles.quickGameName, { color: game.color }]}>{game.name}</Text>
              <View style={[styles.comingSoonBadge, { backgroundColor: game.color + '20' }]}>
                <Text style={[styles.comingSoonText, { color: game.color }]}>Play</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <Ionicons name="trophy" size={22} color={Colors.accent} />
          <View style={styles.statsText}>
            <Text style={styles.statsBannerTitle}>{t('games.startPlaying')}</Text>
            <Text style={styles.statsBannerSubtitle}>{t('games.challengeDesc')}</Text>
          </View>
          <View style={styles.statsEmojis}>
            <Text style={{ fontSize: 20 }}>👴</Text>
            <Text style={{ fontSize: 20 }}>🤝</Text>
            <Text style={{ fontSize: 20 }}>👧</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
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
  headerSubtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
  headerEmoji: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text,
    paddingHorizontal: Spacing.xl, marginBottom: Spacing.md, marginTop: Spacing.sm,
  },
  gameCard: {
    marginHorizontal: Spacing.xl, borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md, overflow: 'hidden', ...Shadow.medium, padding: Spacing.lg,
  },
  decorCircle1: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    right: -30, top: -40,
  },
  decorCircle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    right: 40, bottom: -30,
  },
  gameCardContent: { flexDirection: 'row', alignItems: 'center' },
  gameCardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  gameEmojiContainer: {
    width: 64, height: 64, borderRadius: BorderRadius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  gameEmoji: { fontSize: 34 },
  gameInfo: { flex: 1 },
  gameName: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  gameDesc: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.7)', marginBottom: 8, lineHeight: 18 },
  gameTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  gameTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full, flexDirection: 'row', alignItems: 'center', gap: 3 },
  gameTagText: { fontSize: 11, fontWeight: '700' },
  gameTagTextLight: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  playBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: BorderRadius.xl, marginLeft: Spacing.md,
  },
  playBtnText: { fontWeight: '800', fontSize: FontSizes.md },
  quickGamesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md,
    paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg,
  },
  quickGameCard: {
    width: '47%', alignItems: 'center', padding: Spacing.lg,
    borderRadius: BorderRadius.xl, borderWidth: 1.5,
  },
  quickGameEmoji: { fontSize: 36, marginBottom: 8 },
  quickGameName: { fontSize: FontSizes.sm, fontWeight: '700', marginBottom: 6 },
  comingSoonBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  comingSoonText: { fontSize: 10, fontWeight: '700' },
  statsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.accent + '20', marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.accent + '40',
  },
  statsText: { flex: 1 },
  statsBannerTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text },
  statsBannerSubtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
  statsEmojis: { flexDirection: 'row', gap: 4 },
});
