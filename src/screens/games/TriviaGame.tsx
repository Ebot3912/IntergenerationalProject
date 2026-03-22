import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  StatusBar, ScrollView, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../../utils/theme';

const { width } = Dimensions.get('window');
const DARK_BG = '#1A1040';
const CARD_BG = '#2A1F5E';
const CARD_LIGHT = '#362B72';
const TIMER_SECONDS = 15;

type Category = 'History' | 'Nature' | 'Science' | 'Geography' | 'Pop Culture' | 'Food' | 'Animals' | 'Sports';

interface Question {
  category: Category;
  question: string;
  options: string[];
  correct: number; // index of correct answer
}

const ALL_QUESTIONS: Question[] = [
  // History
  { category: 'History', question: 'Which ancient wonder was located in Egypt?', options: ['Hanging Gardens', 'Great Pyramid of Giza', 'Colossus of Rhodes', 'Temple of Artemis'], correct: 1 },
  { category: 'History', question: 'Who was the first person to walk on the Moon?', options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'John Glenn'], correct: 2 },
  { category: 'History', question: 'What year did the Titanic sink?', options: ['1905', '1912', '1920', '1898'], correct: 1 },
  // Nature
  { category: 'Nature', question: 'What is the tallest type of tree in the world?', options: ['Oak', 'Sequoia', 'Coast Redwood', 'Douglas Fir'], correct: 2 },
  { category: 'Nature', question: 'What causes the seasons on Earth?', options: ['Distance from the Sun', 'Earth\'s tilted axis', 'Moon\'s gravity', 'Solar flares'], correct: 1 },
  { category: 'Nature', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3 },
  // Science
  { category: 'Science', question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
  { category: 'Science', question: 'What gas do plants absorb from the air?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 2 },
  { category: 'Science', question: 'How many bones does an adult human have?', options: ['186', '206', '226', '246'], correct: 1 },
  // Geography
  { category: 'Geography', question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correct: 1 },
  { category: 'Geography', question: 'Which country has the most people?', options: ['USA', 'India', 'China', 'Indonesia'], correct: 1 },
  { category: 'Geography', question: 'What is the smallest continent?', options: ['Europe', 'Antarctica', 'Australia', 'South America'], correct: 2 },
  // Pop Culture
  { category: 'Pop Culture', question: 'What color are Smurfs?', options: ['Green', 'Blue', 'Purple', 'Red'], correct: 1 },
  { category: 'Pop Culture', question: 'Who lives in a pineapple under the sea?', options: ['Nemo', 'Patrick', 'SpongeBob', 'Squidward'], correct: 2 },
  { category: 'Pop Culture', question: 'What is Mickey Mouse\'s dog\'s name?', options: ['Goofy', 'Pluto', 'Max', 'Buddy'], correct: 1 },
  // Food
  { category: 'Food', question: 'What fruit is on top of a traditional Hawaiian pizza?', options: ['Mango', 'Banana', 'Pineapple', 'Coconut'], correct: 2 },
  { category: 'Food', question: 'What is the main ingredient in guacamole?', options: ['Tomato', 'Avocado', 'Pepper', 'Onion'], correct: 1 },
  { category: 'Food', question: 'Which country is sushi originally from?', options: ['China', 'Korea', 'Thailand', 'Japan'], correct: 3 },
  // Animals
  { category: 'Animals', question: 'What is the fastest land animal?', options: ['Lion', 'Cheetah', 'Horse', 'Greyhound'], correct: 1 },
  { category: 'Animals', question: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], correct: 1 },
  { category: 'Animals', question: 'What animal is known for carrying its home on its back?', options: ['Snail', 'Crab', 'Turtle', 'Armadillo'], correct: 2 },
  { category: 'Animals', question: 'What is a group of lions called?', options: ['Pack', 'Herd', 'Flock', 'Pride'], correct: 3 },
  // Sports
  { category: 'Sports', question: 'How many players are on a soccer team on the field?', options: ['9', '10', '11', '12'], correct: 2 },
  { category: 'Sports', question: 'In which sport do you use a shuttlecock?', options: ['Tennis', 'Badminton', 'Squash', 'Table Tennis'], correct: 1 },
  { category: 'Sports', question: 'What sport is played at Wimbledon?', options: ['Golf', 'Cricket', 'Tennis', 'Soccer'], correct: 2 },
  // More History
  { category: 'History', question: 'What wall was torn down in Berlin in 1989?', options: ['Great Wall', 'Berlin Wall', 'Hadrian\'s Wall', 'Wall of China'], correct: 1 },
  // More Science
  { category: 'Science', question: 'What is the chemical symbol for water?', options: ['HO', 'H2O', 'WA', 'O2H'], correct: 1 },
  { category: 'Science', question: 'What force keeps us on the ground?', options: ['Magnetism', 'Friction', 'Gravity', 'Inertia'], correct: 2 },
  // More Animals
  { category: 'Animals', question: 'What is the largest mammal in the world?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'], correct: 1 },
  // More Geography
  { category: 'Geography', question: 'What is the capital of France?', options: ['London', 'Berlin', 'Madrid', 'Paris'], correct: 3 },
  // More Food
  { category: 'Food', question: 'What nut is used to make marzipan?', options: ['Walnut', 'Cashew', 'Almond', 'Peanut'], correct: 2 },
];

const CATEGORIES: Category[] = ['History', 'Nature', 'Science', 'Geography', 'Pop Culture', 'Food', 'Animals', 'Sports'];

const CATEGORY_ICONS: Record<Category, string> = {
  History: 'time-outline',
  Nature: 'leaf-outline',
  Science: 'flask-outline',
  Geography: 'globe-outline',
  'Pop Culture': 'star-outline',
  Food: 'restaurant-outline',
  Animals: 'paw-outline',
  Sports: 'football-outline',
};

const CATEGORY_COLORS: Record<Category, string> = {
  History: '#FF6B6B',
  Nature: '#6BCB77',
  Science: '#4D96FF',
  Geography: '#FFD93D',
  'Pop Culture': '#FF9FF3',
  Food: '#FF9F43',
  Animals: '#A29BFE',
  Sports: '#00D2D3',
};

type Screen = 'menu' | 'playing' | 'results';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TriviaGame({ navigation }: any) {
  const [screen, setScreen] = useState<Screen>('menu');
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] ?? null;

  // Timer logic
  useEffect(() => {
    if (screen !== 'playing' || isAnswered) return;
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIndex, screen, isAnswered]);

  // Animate question entry
  useEffect(() => {
    if (screen === 'playing') {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
      ]).start();
    }
  }, [currentIndex, screen]);

  // Progress bar animation
  useEffect(() => {
    if (screen === 'playing') {
      Animated.timing(progressAnim, {
        toValue: (currentIndex + 1) / totalQuestions,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [currentIndex, screen, totalQuestions]);

  const handleTimeout = useCallback(() => {
    setIsAnswered(true);
    setSelectedAnswer(null);
    setStreak(0);
    setAnswers(prev => [...prev, null]);
  }, []);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const startGame = () => {
    const filtered = selectedCategories.size > 0
      ? ALL_QUESTIONS.filter(q => selectedCategories.has(q.category))
      : ALL_QUESTIONS;
    const shuffled = shuffle(filtered).slice(0, Math.min(filtered.length, 15));
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setAnswers([]);
    progressAnim.setValue(0);
    setScreen('playing');
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion!.correct;
    if (isCorrect) {
      const newStreak = streak + 1;
      setScore(prev => prev + 1);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
    setAnswers(prev => [...prev, index]);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setScreen('results');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) return styles.optionDefault;
    if (index === currentQuestion!.correct) return styles.optionCorrect;
    if (index === selectedAnswer && index !== currentQuestion!.correct) return styles.optionWrong;
    return styles.optionDimmed;
  };

  const getOptionTextStyle = (index: number) => {
    if (!isAnswered) return styles.optionTextDefault;
    if (index === currentQuestion!.correct) return styles.optionTextCorrect;
    if (index === selectedAnswer && index !== currentQuestion!.correct) return styles.optionTextWrong;
    return styles.optionTextDimmed;
  };

  const getOptionIcon = (index: number): string | null => {
    if (!isAnswered) return null;
    if (index === currentQuestion!.correct) return 'checkmark-circle';
    if (index === selectedAnswer && index !== currentQuestion!.correct) return 'close-circle';
    return null;
  };

  const timerColor = timeLeft <= 5 ? Colors.danger : timeLeft <= 10 ? Colors.warning : Colors.accentGreen;

  // ===================== MENU SCREEN =====================
  if (screen === 'menu') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trivia Quiz</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.menuContent} showsVerticalScrollIndicator={false}>
          <View style={styles.menuIconWrap}>
            <Ionicons name="help-circle" size={64} color={Colors.primary} />
          </View>
          <Text style={styles.menuTitle}>Choose Your Categories</Text>
          <Text style={styles.menuSubtitle}>Select categories or leave empty for a random mix!</Text>

          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategories.has(cat);
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    isSelected && { backgroundColor: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] },
                  ]}
                  onPress={() => toggleCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={CATEGORY_ICONS[cat] as any}
                    size={20}
                    color={isSelected ? '#fff' : CATEGORY_COLORS[cat]}
                  />
                  <Text style={[styles.categoryChipText, isSelected && { color: '#fff' }]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={startGame} activeOpacity={0.8}>
            <Ionicons name="play" size={22} color={Colors.white} style={{ marginRight: Spacing.sm }} />
            <Text style={styles.startBtnText}>Start Quiz</Text>
          </TouchableOpacity>

          <View style={styles.rulesCard}>
            <Text style={styles.rulesTitle}>How to Play</Text>
            <View style={styles.ruleRow}>
              <Ionicons name="time-outline" size={18} color={Colors.accent} />
              <Text style={styles.ruleText}>15 seconds per question</Text>
            </View>
            <View style={styles.ruleRow}>
              <Ionicons name="flame-outline" size={18} color={Colors.secondary} />
              <Text style={styles.ruleText}>Build your answer streak</Text>
            </View>
            <View style={styles.ruleRow}>
              <Ionicons name="trophy-outline" size={18} color={Colors.accentGreen} />
              <Text style={styles.ruleText}>Aim for the highest score</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===================== RESULTS SCREEN =====================
  if (screen === 'results') {
    const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const emoji = pct >= 80 ? 'trophy' : pct >= 50 ? 'happy' : 'sad';
    const message = pct >= 80 ? 'Amazing Job!' : pct >= 50 ? 'Good Effort!' : 'Keep Practicing!';

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Results</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.resultsContent} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsIconWrap}>
            <Ionicons name={emoji as any} size={72} color={Colors.accent} />
          </View>
          <Text style={styles.resultsMessage}>{message}</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreBig}>{score}/{totalQuestions}</Text>
            <Text style={styles.scorePct}>{pct}% Correct</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="checkmark-circle" size={28} color={Colors.accentGreen} />
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="close-circle" size={28} color={Colors.danger} />
              <Text style={styles.statValue}>{totalQuestions - score}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="flame" size={28} color={Colors.warning} />
              <Text style={styles.statValue}>{bestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>

          <Text style={styles.reviewTitle}>Review Answers</Text>
          {questions.map((q, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === q.correct;
            const isTimeout = userAns === null;
            return (
              <View key={i} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Ionicons
                    name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={isCorrect ? Colors.accentGreen : Colors.danger}
                  />
                  <Text style={styles.reviewQ} numberOfLines={2}>Q{i + 1}: {q.question}</Text>
                </View>
                <Text style={styles.reviewAnswer}>
                  {isTimeout ? 'Time ran out' : `Your answer: ${q.options[userAns!]}`}
                </Text>
                {!isCorrect && (
                  <Text style={styles.reviewCorrect}>Correct: {q.options[q.correct]}</Text>
                )}
              </View>
            );
          })}

          <View style={styles.resultsButtons}>
            <TouchableOpacity style={styles.playAgainBtn} onPress={() => { setScreen('menu'); }} activeOpacity={0.8}>
              <Ionicons name="refresh" size={20} color={Colors.white} style={{ marginRight: Spacing.sm }} />
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exitBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Ionicons name="exit-outline" size={20} color={Colors.white} style={{ marginRight: Spacing.sm }} />
              <Text style={styles.exitBtnText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===================== PLAYING SCREEN =====================
  if (!currentQuestion) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Question {currentIndex + 1}/{totalQuestions}</Text>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color={Colors.warning} />
          <Text style={styles.streakText}>{streak}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.playContent} showsVerticalScrollIndicator={false}>
        {/* Timer */}
        <View style={styles.timerRow}>
          <View style={[styles.timerCircle, { borderColor: timerColor }]}>
            <Text style={[styles.timerNumber, { color: timerColor }]}>{timeLeft}</Text>
          </View>
          <View style={styles.categoryTag}>
            <Ionicons name={CATEGORY_ICONS[currentQuestion.category] as any} size={14} color={CATEGORY_COLORS[currentQuestion.category]} />
            <Text style={[styles.categoryTagText, { color: CATEGORY_COLORS[currentQuestion.category] }]}>
              {currentQuestion.category}
            </Text>
          </View>
          <View style={styles.scoreDisplay}>
            <Ionicons name="star" size={16} color={Colors.accent} />
            <Text style={styles.scoreDisplayText}>{score}</Text>
          </View>
        </View>

        {/* Question Card */}
        <Animated.View style={[styles.questionCard, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </Animated.View>

        {/* Options */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {currentQuestion.options.map((opt, i) => {
            const icon = getOptionIcon(i);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.optionBtn, getOptionStyle(i)]}
                onPress={() => handleAnswer(i)}
                activeOpacity={isAnswered ? 1 : 0.7}
                disabled={isAnswered}
              >
                <View style={styles.optionLetter}>
                  <Text style={styles.optionLetterText}>{String.fromCharCode(65 + i)}</Text>
                </View>
                <Text style={[styles.optionText, getOptionTextStyle(i)]} numberOfLines={2}>{opt}</Text>
                {icon && <Ionicons name={icon as any} size={22} color={icon === 'checkmark-circle' ? Colors.accentGreen : Colors.danger} />}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Feedback & Next */}
        {isAnswered && (
          <View style={styles.feedbackArea}>
            {selectedAnswer === null ? (
              <Text style={styles.feedbackTimeout}>Time's up! The answer was: {currentQuestion.options[currentQuestion.correct]}</Text>
            ) : selectedAnswer === currentQuestion.correct ? (
              <Text style={styles.feedbackCorrect}>Correct! Great job!</Text>
            ) : (
              <Text style={styles.feedbackWrong}>
                Wrong! The answer was: {currentQuestion.options[currentQuestion.correct]}
              </Text>
            )}
            <TouchableOpacity style={styles.nextBtn} onPress={nextQuestion} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>
                {currentIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  streakText: {
    color: Colors.warning,
    fontSize: FontSizes.md,
    fontWeight: '700',
    marginLeft: 4,
  },
  // Progress Bar
  progressBarBg: {
    height: 6,
    backgroundColor: CARD_BG,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  // Play Content
  playContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  timerCircle: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD_BG,
  },
  timerNumber: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  categoryTagText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginLeft: 4,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  scoreDisplayText: {
    color: Colors.accent,
    fontSize: FontSizes.md,
    fontWeight: '700',
    marginLeft: 4,
  },
  // Question Card
  questionCard: {
    backgroundColor: CARD_BG,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadow.medium,
  },
  questionText: {
    color: Colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
  },
  // Options
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: CARD_LIGHT,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: CARD_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionLetterText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    fontSize: FontSizes.lg,
  },
  optionDefault: {
    borderColor: CARD_LIGHT,
  },
  optionCorrect: {
    borderColor: Colors.accentGreen,
    backgroundColor: 'rgba(107,203,119,0.15)',
  },
  optionWrong: {
    borderColor: Colors.danger,
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  optionDimmed: {
    borderColor: CARD_LIGHT,
    opacity: 0.4,
  },
  optionTextDefault: {
    color: Colors.white,
  },
  optionTextCorrect: {
    color: Colors.accentGreen,
    fontWeight: '700',
  },
  optionTextWrong: {
    color: Colors.danger,
    fontWeight: '700',
  },
  optionTextDimmed: {
    color: 'rgba(255,255,255,0.4)',
  },
  // Feedback
  feedbackArea: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  feedbackCorrect: {
    color: Colors.accentGreen,
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  feedbackWrong: {
    color: Colors.danger,
    fontSize: FontSizes.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  feedbackTimeout: {
    color: Colors.warning,
    fontSize: FontSizes.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    ...Shadow.medium,
  },
  nextBtnText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginRight: Spacing.sm,
  },
  // Menu
  menuContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  menuIconWrap: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.large,
  },
  menuTitle: {
    color: Colors.white,
    fontSize: FontSizes.xxxl,
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  menuSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: CARD_LIGHT,
    backgroundColor: CARD_BG,
  },
  categoryChipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xxl,
    width: '80%',
    ...Shadow.large,
  },
  startBtnText: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
  rulesCard: {
    backgroundColor: CARD_BG,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
  },
  rulesTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ruleText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSizes.md,
    marginLeft: Spacing.sm,
  },
  // Results
  resultsContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  resultsIconWrap: {
    width: 110,
    height: 110,
    borderRadius: BorderRadius.full,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.large,
  },
  resultsMessage: {
    color: Colors.white,
    fontSize: FontSizes.xxxl,
    fontWeight: '800',
    marginBottom: Spacing.xl,
  },
  scoreCard: {
    backgroundColor: CARD_BG,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xxxl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.large,
  },
  scoreBig: {
    color: Colors.accent,
    fontSize: FontSizes.display + 8,
    fontWeight: '900',
  },
  scorePct: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FontSizes.lg,
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Spacing.xxl,
  },
  statBox: {
    backgroundColor: CARD_BG,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    minWidth: 90,
    ...Shadow.small,
  },
  statValue: {
    color: Colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    marginTop: Spacing.xs,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: FontSizes.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  reviewTitle: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  reviewItem: {
    backgroundColor: CARD_BG,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    width: '100%',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  reviewQ: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginLeft: Spacing.sm,
    flex: 1,
  },
  reviewAnswer: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FontSizes.sm,
    marginLeft: 28,
  },
  reviewCorrect: {
    color: Colors.accentGreen,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginLeft: 28,
    marginTop: 2,
  },
  resultsButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  playAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    ...Shadow.medium,
  },
  playAgainText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_LIGHT,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  exitBtnText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
});
