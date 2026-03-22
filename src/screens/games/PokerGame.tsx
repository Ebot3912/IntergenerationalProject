import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  StatusBar, Alert, Dimensions, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../../utils/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.floor((width - 80) / 5.5);
const CARD_HEIGHT = CARD_WIDTH * 1.4;

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
type Card = { suit: Suit; rank: Rank; faceUp?: boolean };

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
};

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ suit, rank });
  return shuffle(deck);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isRed(suit: Suit) { return suit === '♥' || suit === '♦'; }

// Hand evaluation
function evaluateHand(cards: Card[]): { rank: number; name: string; tiebreaker: number[] } {
  if (cards.length < 5) return { rank: 0, name: 'No hand', tiebreaker: [] };
  const vals = cards.map(c => RANK_VALUES[c.rank]).sort((a, b) => b - a);
  const suits = cards.map(c => c.suit);
  const isFlush = suits.every(s => s === suits[0]);
  const sortedVals = [...vals].sort((a, b) => b - a);
  const isStraight = sortedVals.every((v, i) => i === 0 || sortedVals[i - 1] - v === 1);
  const isStraightLow = JSON.stringify(sortedVals) === JSON.stringify([14, 5, 4, 3, 2]);

  const freq: Record<number, number> = {};
  vals.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const counts = Object.values(freq).sort((a, b) => b - a);

  if (isFlush && (isStraight || isStraightLow) && sortedVals[0] === 14) return { rank: 9, name: 'Royal Flush', tiebreaker: sortedVals };
  if (isFlush && (isStraight || isStraightLow)) return { rank: 8, name: 'Straight Flush', tiebreaker: sortedVals };
  if (counts[0] === 4) return { rank: 7, name: 'Four of a Kind', tiebreaker: sortedVals };
  if (counts[0] === 3 && counts[1] === 2) return { rank: 6, name: 'Full House', tiebreaker: sortedVals };
  if (isFlush) return { rank: 5, name: 'Flush', tiebreaker: sortedVals };
  if (isStraight || isStraightLow) return { rank: 4, name: 'Straight', tiebreaker: sortedVals };
  if (counts[0] === 3) return { rank: 3, name: 'Three of a Kind', tiebreaker: sortedVals };
  if (counts[0] === 2 && counts[1] === 2) return { rank: 2, name: 'Two Pair', tiebreaker: sortedVals };
  if (counts[0] === 2) return { rank: 1, name: 'One Pair', tiebreaker: sortedVals };
  return { rank: 0, name: 'High Card', tiebreaker: sortedVals };
}

type GamePhase = 'pre-deal' | 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown';

export default function PokerGame({ navigation }: any) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [aiHand, setAiHand] = useState<Card[]>([]);
  const [community, setCommunity] = useState<Card[]>([]);
  const [phase, setPhase] = useState<GamePhase>('pre-deal');
  const [playerChips, setPlayerChips] = useState(1000);
  const [aiChips, setAiChips] = useState(1000);
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [playerBet, setPlayerBet] = useState(0);
  const [aiBet, setAiBet] = useState(0);
  const [message, setMessage] = useState('Welcome to Texas Hold\'em! Press Deal to start.');
  const [playerFolded, setPlayerFolded] = useState(false);
  const [aiFolded, setAiFolded] = useState(false);
  const [handResult, setHandResult] = useState('');

  const dealGame = useCallback(() => {
    const d = createDeck();
    const ph = [d[0], d[1]];
    const ah = [d[2], d[3]];
    const rest = d.slice(4);
    setDeck(rest);
    setPlayerHand(ph);
    setAiHand(ah.map(c => ({ ...c, faceUp: false })));
    setCommunity([]);
    setPhase('pre-flop');
    setPlayerFolded(false);
    setAiFolded(false);
    setHandResult('');
    const blind = 20;
    setPot(blind * 2);
    setCurrentBet(blind);
    setPlayerBet(blind);
    setAiBet(blind);
    setPlayerChips(c => c - blind);
    setAiChips(c => c - blind);
    setMessage('Cards dealt! Pre-flop — Check, Raise, or Fold?');
  }, []);

  const aiDecide = (handCards: Card[], comm: Card[], potSize: number, toCall: number): 'call' | 'raise' | 'fold' => {
    const allCards = [...handCards, ...comm];
    const hand = evaluateHand(allCards);
    const odds = Math.random();
    if (hand.rank >= 4 || (hand.rank >= 2 && odds > 0.3)) return odds > 0.5 ? 'raise' : 'call';
    if (hand.rank >= 1 && odds > 0.4) return 'call';
    if (toCall > potSize * 0.5 && hand.rank < 2) return odds > 0.7 ? 'fold' : 'call';
    return 'call';
  };

  const doAIAction = (currentDeck: Card[], comm: Card[]) => {
    const aiCards = aiHand.map(c => ({ ...c, faceUp: true }));
    const toCall = currentBet - aiBet;
    const action = aiDecide(aiCards, comm, pot, toCall);

    setTimeout(() => {
      if (action === 'fold') {
        setAiFolded(true);
        setMessage('🤖 AI folds! You win the pot!');
        setPlayerChips(c => c + pot + toCall);
        setPot(0);
        setPhase('showdown');
        setHandResult('You win! AI folded.');
      } else if (action === 'raise') {
        const raise = Math.min(50, aiChips);
        setAiChips(c => c - raise - toCall);
        setAiBet(b => b + raise + toCall);
        setCurrentBet(c => c + raise);
        setPot(p => p + raise + toCall);
        setMessage(`🤖 AI raises ${raise}!`);
      } else {
        setAiChips(c => c - toCall);
        setAiBet(b => b + toCall);
        setPot(p => p + toCall);
        setMessage('🤖 AI calls. Your move for next street.');
      }
    }, 800);
  };

  const playerAction = (action: 'check' | 'call' | 'raise' | 'fold') => {
    const toCall = currentBet - playerBet;

    if (action === 'fold') {
      setPlayerFolded(true);
      setAiChips(c => c + pot);
      setPot(0);
      setMessage('You folded. AI wins the pot!');
      setPhase('showdown');
      setHandResult('AI wins! You folded.');
      return;
    }

    if (action === 'check') {
      if (toCall > 0) { setMessage("Can't check — there's a bet. Call or Fold."); return; }
      advancePhase(deck, community);
      return;
    }

    if (action === 'call') {
      if (playerChips < toCall) { setMessage("Not enough chips!"); return; }
      setPlayerChips(c => c - toCall);
      setPlayerBet(b => b + toCall);
      setPot(p => p + toCall);
      advancePhase(deck, community);
      return;
    }

    if (action === 'raise') {
      const raise = 50;
      const total = toCall + raise;
      if (playerChips < total) { setMessage("Not enough chips!"); return; }
      setPlayerChips(c => c - total);
      setPlayerBet(b => b + total);
      setCurrentBet(c => c + raise);
      setPot(p => p + total);
      setMessage(`You raise ${raise}. AI is thinking...`);
      doAIAction(deck, community);
    }
  };

  const advancePhase = (currentDeck: Card[], currentCommunity: Card[]) => {
    const resetBets = () => { setPlayerBet(0); setAiBet(0); setCurrentBet(0); };

    if (phase === 'pre-flop') {
      const flop = currentDeck.slice(0, 3);
      const rest = currentDeck.slice(3);
      setCommunity(flop);
      setDeck(rest);
      setPhase('flop');
      resetBets();
      setMessage('🃏 Flop dealt! Check, Raise, or Fold?');
      doAIAction(rest, flop);
    } else if (phase === 'flop') {
      const turn = [...currentCommunity, currentDeck[0]];
      const rest = currentDeck.slice(1);
      setCommunity(turn);
      setDeck(rest);
      setPhase('turn');
      resetBets();
      setMessage('🃏 Turn card! Check, Raise, or Fold?');
      doAIAction(rest, turn);
    } else if (phase === 'turn') {
      const river = [...currentCommunity, currentDeck[0]];
      const rest = currentDeck.slice(1);
      setCommunity(river);
      setDeck(rest);
      setPhase('river');
      resetBets();
      setMessage('🃏 River card! Final betting round.');
      doAIAction(rest, river);
    } else if (phase === 'river') {
      showdown(currentCommunity);
    }
  };

  const showdown = (comm: Card[]) => {
    const aiCards = aiHand.map(c => ({ ...c, faceUp: true }));
    setAiHand(aiCards);
    setPhase('showdown');

    const playerFive = evaluateHand([...playerHand, ...comm]);
    const aiFive = evaluateHand([...aiCards, ...comm]);

    let result = '';
    if (playerFive.rank > aiFive.rank) {
      result = `🏆 You win with ${playerFive.name}!`;
      setPlayerChips(c => c + pot);
    } else if (aiFive.rank > playerFive.rank) {
      result = `🤖 AI wins with ${aiFive.name}!`;
      setAiChips(c => c + pot);
    } else {
      result = `Split pot! Both have ${playerFive.name}.`;
      setPlayerChips(c => c + Math.floor(pot / 2));
      setAiChips(c => c + Math.floor(pot / 2));
    }
    setPot(0);
    setHandResult(result);
    setMessage(result);
  };

  const canCheck = currentBet === playerBet;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.pokerFelt} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🃏 Texas Hold'em</Text>
        <TouchableOpacity onPress={dealGame} style={styles.dealBtn}>
          <Text style={styles.dealBtnText}>New Hand</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Chips */}
        <View style={styles.chipsRow}>
          <ChipDisplay label="Your Chips" chips={playerChips} color={Colors.accentGreen} />
          <View style={styles.potDisplay}>
            <Text style={styles.potLabel}>Pot</Text>
            <Text style={styles.potAmount}>${pot}</Text>
          </View>
          <ChipDisplay label="AI Chips" chips={aiChips} color={Colors.secondary} reverse />
        </View>

        {/* AI Hand */}
        <View style={styles.handSection}>
          <Text style={styles.handLabel}>🤖 AI's Hand {aiFolded ? '(Folded)' : ''}</Text>
          <View style={styles.handRow}>
            {aiHand.map((card, i) => (
              <CardView key={i} card={card} />
            ))}
          </View>
          {phase === 'showdown' && !aiFolded && (
            <Text style={styles.handStrength}>{evaluateHand([...aiHand.map(c=>({...c,faceUp:true})), ...community]).name}</Text>
          )}
        </View>

        {/* Community Cards */}
        <View style={styles.communitySection}>
          <Text style={styles.communityLabel}>Community Cards</Text>
          <View style={styles.communityRow}>
            {[0, 1, 2, 3, 4].map(i => (
              <View key={i} style={styles.communitySlot}>
                {community[i] ? (
                  <CardView card={{ ...community[i], faceUp: true }} />
                ) : (
                  <View style={[styles.cardBack, styles.communityEmpty]}>
                    <Text style={styles.cardBackText}>?</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Message */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
          {handResult ? <Text style={styles.handResultText}>{handResult}</Text> : null}
        </View>

        {/* Player Hand */}
        <View style={styles.handSection}>
          <Text style={styles.handLabel}>🎴 Your Hand {playerFolded ? '(Folded)' : ''}</Text>
          <View style={styles.handRow}>
            {playerHand.map((card, i) => (
              <CardView key={i} card={{ ...card, faceUp: true }} large />
            ))}
          </View>
          {phase !== 'pre-deal' && (
            <Text style={styles.handStrength}>{evaluateHand([...playerHand, ...community]).name}</Text>
          )}
        </View>

        {/* Actions */}
        {phase !== 'pre-deal' && phase !== 'showdown' && !playerFolded && !aiFolded && (
          <View style={styles.actionsRow}>
            <ActionButton label="Fold" onPress={() => playerAction('fold')} color={Colors.danger} />
            {canCheck ? (
              <ActionButton label="Check" onPress={() => playerAction('check')} color={Colors.textSecondary} />
            ) : (
              <ActionButton label={`Call $${currentBet - playerBet}`} onPress={() => playerAction('call')} color={Colors.accentBlue} />
            )}
            <ActionButton label="Raise $50" onPress={() => playerAction('raise')} color={Colors.accentGreen} />
          </View>
        )}

        {(phase === 'pre-deal' || phase === 'showdown') && (
          <TouchableOpacity style={styles.dealMainBtn} onPress={dealGame}>
            <Ionicons name="play-circle" size={24} color={Colors.white} />
            <Text style={styles.dealMainBtnText}>{phase === 'pre-deal' ? 'Deal Cards' : 'Next Hand'}</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function CardView({ card, large }: { card: Card; large?: boolean }) {
  const cw = large ? CARD_WIDTH * 1.2 : CARD_WIDTH;
  const ch = large ? CARD_HEIGHT * 1.2 : CARD_HEIGHT;

  if (!card.faceUp) {
    return (
      <View style={[styles.cardBack, { width: cw, height: ch }]}>
        <Text style={styles.cardBackText}>🂠</Text>
      </View>
    );
  }

  const red = isRed(card.suit);
  return (
    <View style={[styles.card, { width: cw, height: ch }]}>
      <Text style={[styles.cardRankTop, { color: red ? Colors.secondary : Colors.text }]}>{card.rank}</Text>
      <Text style={[styles.cardSuit, { color: red ? Colors.secondary : Colors.text }]}>{card.suit}</Text>
      <Text style={[styles.cardRankBottom, { color: red ? Colors.secondary : Colors.text }]}>{card.rank}</Text>
    </View>
  );
}

function ChipDisplay({ label, chips, color, reverse }: any) {
  return (
    <View style={[styles.chipDisplay, reverse && styles.chipDisplayReverse]}>
      <Text style={styles.chipLabel}>{label}</Text>
      <View style={[styles.chipAmount, { backgroundColor: color + '20', borderColor: color + '40' }]}>
        <Ionicons name="logo-usd" size={14} color={color} />
        <Text style={[styles.chipNum, { color }]}>{chips}</Text>
      </View>
    </View>
  );
}

function ActionButton({ label, onPress, color }: any) {
  return (
    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.actionBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pokerFelt },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: Colors.pokerFelt,
  },
  backBtn: { padding: 8 },
  headerTitle: { flex: 1, fontSize: FontSizes.xl, fontWeight: '800', color: Colors.white, textAlign: 'center' },
  dealBtn: {
    backgroundColor: Colors.accent, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  dealBtnText: { color: Colors.pokerFelt, fontWeight: '800', fontSize: FontSizes.sm },
  content: { padding: Spacing.md },
  chipsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  chipDisplay: { alignItems: 'flex-start' },
  chipDisplayReverse: { alignItems: 'flex-end' },
  chipLabel: { color: 'rgba(255,255,255,0.6)', fontSize: FontSizes.xs, marginBottom: 4 },
  chipAmount: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: BorderRadius.full, borderWidth: 1,
  },
  chipNum: { fontWeight: '800', fontSize: FontSizes.md },
  potDisplay: { alignItems: 'center' },
  potLabel: { color: 'rgba(255,255,255,0.6)', fontSize: FontSizes.xs },
  potAmount: { color: Colors.accent, fontSize: FontSizes.xxl, fontWeight: '900' },
  handSection: { alignItems: 'center', marginBottom: Spacing.md },
  handLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm, fontWeight: '600', marginBottom: 8 },
  handRow: { flexDirection: 'row', gap: 8 },
  handStrength: {
    color: Colors.accent, fontSize: FontSizes.sm, fontWeight: '700', marginTop: 6,
  },
  communitySection: { alignItems: 'center', marginBottom: Spacing.md },
  communityLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm, fontWeight: '600', marginBottom: 8 },
  communityRow: { flexDirection: 'row', gap: 6 },
  communitySlot: {},
  communityEmpty: { borderStyle: 'dashed', borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'transparent' },
  messageBox: {
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md, alignItems: 'center',
  },
  messageText: { color: Colors.white, fontSize: FontSizes.sm, textAlign: 'center', lineHeight: 20 },
  handResultText: { color: Colors.accent, fontSize: FontSizes.lg, fontWeight: '800', marginTop: 4 },
  actionsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: BorderRadius.xl, alignItems: 'center' },
  actionBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.sm },
  dealMainBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.accent, paddingVertical: 16, borderRadius: BorderRadius.xl,
    ...Shadow.medium, marginBottom: Spacing.md,
  },
  dealMainBtnText: { color: Colors.pokerFelt, fontWeight: '800', fontSize: FontSizes.xl },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.sm,
    padding: 4, alignItems: 'center', justifyContent: 'center',
    ...Shadow.small, position: 'relative',
  },
  cardRankTop: { position: 'absolute', top: 2, left: 4, fontSize: 11, fontWeight: '800' },
  cardSuit: { fontSize: 22 },
  cardRankBottom: { position: 'absolute', bottom: 2, right: 4, fontSize: 11, fontWeight: '800', transform: [{ rotate: '180deg' }] },
  cardBack: {
    backgroundColor: '#1B2A6B', borderRadius: BorderRadius.sm,
    alignItems: 'center', justifyContent: 'center', ...Shadow.small,
  },
  cardBackText: { fontSize: 28, color: Colors.white },
});
