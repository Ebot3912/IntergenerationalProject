import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  StatusBar, Alert, Dimensions, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../../utils/theme';

const { width } = Dimensions.get('window');
const GRID_SIZE = 10;
const CELL_SIZE = Math.floor((width - Spacing.lg * 2 - Spacing.xs * (GRID_SIZE - 1)) / GRID_SIZE);

const WORD_POOL = [
  'FAMILY', 'LOVE', 'BRIDGE', 'SHARE', 'STORY',
  'WISDOM', 'PLAY', 'FRIEND', 'CARE', 'HEART',
  'HOPE', 'BOND', 'TRUST', 'JOY', 'KIND',
  'LEARN', 'GROW', 'PEACE', 'SMILE', 'HELP',
];

type Direction = [number, number];
const DIRECTIONS: Direction[] = [
  [0, 1],   // right
  [1, 0],   // down
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
  [0, -1],  // left
  [-1, 0],  // up
  [-1, -1], // diagonal up-left
  [-1, 1],  // diagonal up-right
];

interface PlacedWord {
  word: string;
  startRow: number;
  startCol: number;
  direction: Direction;
  cells: [number, number][];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function canPlace(grid: string[][], word: string, row: number, col: number, dir: Direction): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = row + dir[0] * i;
    const c = col + dir[1] * i;
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(grid: string[][], word: string, row: number, col: number, dir: Direction): [number, number][] {
  const cells: [number, number][] = [];
  for (let i = 0; i < word.length; i++) {
    const r = row + dir[0] * i;
    const c = col + dir[1] * i;
    grid[r][c] = word[i];
    cells.push([r, c]);
  }
  return cells;
}

function generatePuzzle(): { grid: string[][]; placedWords: PlacedWord[] } {
  const grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  const placedWords: PlacedWord[] = [];
  const candidates = shuffle(WORD_POOL);

  for (const word of candidates) {
    if (placedWords.length >= 8) break;
    const dirs = shuffle([...DIRECTIONS]);
    let placed = false;
    for (const dir of dirs) {
      const positions: [number, number][] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (canPlace(grid, word, r, c, dir)) {
            positions.push([r, c]);
          }
        }
      }
      if (positions.length > 0) {
        const [startRow, startCol] = positions[Math.floor(Math.random() * positions.length)];
        const cells = placeWord(grid, word, startRow, startCol, dir);
        placedWords.push({ word, startRow, startCol, direction: dir, cells });
        placed = true;
        break;
      }
    }
  }

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * 26)];
      }
    }
  }

  return { grid, placedWords };
}

function cellKey(r: number, c: number): string {
  return `${r}-${c}`;
}

export default function WordSearchGame({ navigation }: any) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startNewGame = useCallback(() => {
    const { grid: newGrid, placedWords: newWords } = generatePuzzle();
    setGrid(newGrid);
    setPlacedWords(newWords);
    setFoundWords(new Set());
    setSelectedCells([]);
    setHighlightedCells(new Set());
    setTimer(0);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (isComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isComplete]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleCellPress = (row: number, col: number) => {
    if (isComplete) return;

    const alreadySelected = selectedCells.findIndex(([r, c]) => r === row && c === col);
    if (alreadySelected !== -1) {
      // Deselect if tapping the last selected cell
      if (alreadySelected === selectedCells.length - 1) {
        setSelectedCells(prev => prev.slice(0, -1));
        return;
      }
    }

    // Validate selection forms a line
    const newSelection = [...selectedCells, [row, col] as [number, number]];
    if (newSelection.length >= 2) {
      const dr = newSelection[1][0] - newSelection[0][0];
      const dc = newSelection[1][1] - newSelection[0][1];
      const normDr = dr === 0 ? 0 : dr / Math.abs(dr);
      const normDc = dc === 0 ? 0 : dc / Math.abs(dc);

      // Check each step is exactly 1 cell apart in a consistent direction
      if (Math.abs(dr) > 1 || Math.abs(dc) > 1) {
        if (newSelection.length === 2) {
          // If first two cells aren't adjacent, reset to just new cell
          setSelectedCells([[row, col]]);
          return;
        }
      }

      if (newSelection.length > 2) {
        const lastIdx = newSelection.length - 1;
        const expectedR = newSelection[lastIdx - 1][0] + normDr;
        const expectedC = newSelection[lastIdx - 1][1] + normDc;
        if (row !== expectedR || col !== expectedC) {
          // Doesn't continue the line, start fresh
          setSelectedCells([[row, col]]);
          return;
        }
      }
    }

    setSelectedCells(newSelection);

    // Check if selection matches a word
    const selectedStr = newSelection.map(([r, c]) => grid[r][c]).join('');
    const match = placedWords.find(pw => {
      if (pw.word !== selectedStr) return false;
      return pw.cells.every(([pr, pc], i) => newSelection[i][0] === pr && newSelection[i][1] === pc);
    });

    if (match) {
      const newFound = new Set(foundWords);
      newFound.add(match.word);
      setFoundWords(newFound);

      const newHighlighted = new Set(highlightedCells);
      match.cells.forEach(([r, c]) => newHighlighted.add(cellKey(r, c)));
      setHighlightedCells(newHighlighted);
      setSelectedCells([]);

      if (newFound.size === placedWords.length) {
        setIsComplete(true);
        Alert.alert(
          'Congratulations!',
          `You found all ${placedWords.length} words in ${formatTime(timer)}!`,
          [{ text: 'New Game', onPress: startNewGame }, { text: 'OK' }]
        );
      }
    }
  };

  const getCellStyle = (row: number, col: number) => {
    const key = cellKey(row, col);
    const isHighlighted = highlightedCells.has(key);
    const isSelected = selectedCells.some(([r, c]) => r === row && c === col);

    if (isHighlighted) return styles.cellFound;
    if (isSelected) return styles.cellSelected;
    return styles.cellDefault;
  };

  const getCellTextStyle = (row: number, col: number) => {
    const key = cellKey(row, col);
    const isHighlighted = highlightedCells.has(key);
    const isSelected = selectedCells.some(([r, c]) => r === row && c === col);

    if (isHighlighted) return styles.cellTextFound;
    if (isSelected) return styles.cellTextSelected;
    return styles.cellText;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Word Search</Text>
        <TouchableOpacity onPress={startNewGame} style={styles.headerBtn}>
          <Ionicons name="refresh" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={18} color={Colors.accent} />
          <Text style={styles.statText}>{formatTime(timer)}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle-outline" size={18} color={Colors.accentGreen} />
          <Text style={styles.statText}>
            {foundWords.size} / {placedWords.length}
          </Text>
        </View>
        {isComplete && (
          <View style={styles.completeBadge}>
            <Ionicons name="trophy" size={16} color={Colors.accent} />
            <Text style={styles.completeText}>Complete!</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Grid */}
        <View style={styles.gridContainer}>
          {grid.map((row, rIdx) => (
            <View key={rIdx} style={styles.gridRow}>
              {row.map((letter, cIdx) => (
                <TouchableOpacity
                  key={`${rIdx}-${cIdx}`}
                  style={[styles.cell, getCellStyle(rIdx, cIdx)]}
                  onPress={() => handleCellPress(rIdx, cIdx)}
                  activeOpacity={0.7}
                >
                  <Text style={getCellTextStyle(rIdx, cIdx)}>{letter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Word List */}
        <View style={styles.wordListContainer}>
          <Text style={styles.wordListTitle}>Find These Words</Text>
          <View style={styles.wordGrid}>
            {placedWords.map((pw) => (
              <View key={pw.word} style={styles.wordItem}>
                <Ionicons
                  name={foundWords.has(pw.word) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={foundWords.has(pw.word) ? Colors.accentGreen : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.wordText,
                    foundWords.has(pw.word) && styles.wordTextFound,
                  ]}
                >
                  {pw.word}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hint */}
        <Text style={styles.hintText}>
          Tap letters in a line to spell a word. Tap the last selected letter to undo.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pokerFelt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.white,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.white,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 217, 61, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  completeText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.accent,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  gridContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    ...Shadow.medium,
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    borderRadius: BorderRadius.sm,
  },
  cellDefault: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cellSelected: {
    backgroundColor: Colors.primary,
    ...Shadow.small,
  },
  cellFound: {
    backgroundColor: Colors.accentGreen,
    ...Shadow.small,
  },
  cellText: {
    fontSize: CELL_SIZE > 30 ? FontSizes.lg : FontSizes.md,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
  },
  cellTextSelected: {
    fontSize: CELL_SIZE > 30 ? FontSizes.lg : FontSizes.md,
    fontWeight: '800',
    color: Colors.white,
  },
  cellTextFound: {
    fontSize: CELL_SIZE > 30 ? FontSizes.lg : FontSizes.md,
    fontWeight: '800',
    color: Colors.white,
  },
  wordListContainer: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  wordListTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    minWidth: 100,
  },
  wordText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.white,
  },
  wordTextFound: {
    color: Colors.accentGreen,
    textDecorationLine: 'line-through',
  },
  hintText: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.xl,
  },
});
