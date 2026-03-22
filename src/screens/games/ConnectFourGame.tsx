import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  StatusBar, Alert, Dimensions, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../../utils/theme';

const { width } = Dimensions.get('window');
const COLS = 7;
const ROWS = 6;
const CELL_SIZE = Math.floor((width - 48) / COLS);

type Cell = 0 | 1 | 2; // 0=empty, 1=player1(red), 2=player2(yellow)
type Board = Cell[][];

function createBoard(): Board {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

function checkWinner(board: Board, row: number, col: number, player: Cell): boolean {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    let count = 1;
    for (let d = 1; d < 4; d++) {
      const r = row + dr * d, c = col + dc * d;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break;
      count++;
    }
    for (let d = 1; d < 4; d++) {
      const r = row - dr * d, c = col - dc * d;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break;
      count++;
    }
    if (count >= 4) return true;
  }
  return false;
}

function getWinningCells(board: Board, row: number, col: number, player: Cell): [number, number][] {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    const cells: [number, number][] = [[row, col]];
    for (let d = 1; d < 4; d++) {
      const r = row + dr * d, c = col + dc * d;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break;
      cells.push([r, c]);
    }
    for (let d = 1; d < 4; d++) {
      const r = row - dr * d, c = col - dc * d;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break;
      cells.push([r, c]);
    }
    if (cells.length >= 4) return cells;
  }
  return [];
}

function getAIColumn(board: Board): number {
  // Check if AI can win
  for (let c = 0; c < COLS; c++) {
    const r = getLowestRow(board, c);
    if (r === -1) continue;
    const testBoard = board.map(row => [...row]);
    testBoard[r][c] = 2;
    if (checkWinner(testBoard, r, c, 2)) return c;
  }
  // Block player
  for (let c = 0; c < COLS; c++) {
    const r = getLowestRow(board, c);
    if (r === -1) continue;
    const testBoard = board.map(row => [...row]);
    testBoard[r][c] = 1;
    if (checkWinner(testBoard, r, c, 1)) return c;
  }
  // Prefer center
  const preference = [3, 2, 4, 1, 5, 0, 6];
  for (const c of preference) {
    if (getLowestRow(board, c) !== -1) return c;
  }
  return 0;
}

function getLowestRow(board: Board, col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) return r;
  }
  return -1;
}

const PLAYER_COLORS: Record<number, string> = {
  1: Colors.secondary,    // Red
  2: Colors.connectFourYellow, // Yellow
};

export default function ConnectFourGame({ navigation }: any) {
  const [board, setBoard] = useState<Board>(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [vsAI, setVsAI] = useState(false);
  const [isDraw, setIsDraw] = useState(false);

  const resetGame = () => {
    setBoard(createBoard());
    setCurrentPlayer(1);
    setWinningCells([]);
    setGameOver(false);
    setIsDraw(false);
  };

  const dropPiece = useCallback((col: number) => {
    if (gameOver) return;
    const row = getLowestRow(board, col);
    if (row === -1) return;

    const newBoard = board.map(r => [...r]) as Board;
    newBoard[row][col] = currentPlayer;

    if (checkWinner(newBoard, row, col, currentPlayer)) {
      const wCells = getWinningCells(newBoard, row, col, currentPlayer);
      setBoard(newBoard);
      setWinningCells(wCells);
      setGameOver(true);
      setScores(s => ({ ...s, [currentPlayer === 1 ? 'p1' : 'p2']: s[currentPlayer === 1 ? 'p1' : 'p2'] + 1 }));
      setTimeout(() => Alert.alert('🎉 Winner!',
        `${currentPlayer === 1 ? '🔴 Red' : '🟡 Yellow'} connects four!`, [
        { text: 'Play Again', onPress: resetGame },
        { text: 'Menu', onPress: () => navigation.goBack() },
      ]), 300);
      return;
    }

    // Check draw
    const isFull = newBoard.every(row => row.every(cell => cell !== 0));
    if (isFull) {
      setBoard(newBoard);
      setGameOver(true);
      setIsDraw(true);
      setTimeout(() => Alert.alert('Draw!', "It's a tie! Board is full.", [
        { text: 'Play Again', onPress: resetGame },
        { text: 'Menu', onPress: () => navigation.goBack() },
      ]), 300);
      return;
    }

    const nextPlayer: 1 | 2 = currentPlayer === 1 ? 2 : 1;
    setBoard(newBoard);
    setCurrentPlayer(nextPlayer);

    if (vsAI && nextPlayer === 2) {
      setTimeout(() => {
        const aiCol = getAIColumn(newBoard);
        const aiRow = getLowestRow(newBoard, aiCol);
        if (aiRow === -1) return;
        const aiBoard = newBoard.map(r => [...r]) as Board;
        aiBoard[aiRow][aiCol] = 2;

        if (checkWinner(aiBoard, aiRow, aiCol, 2)) {
          const wCells = getWinningCells(aiBoard, aiRow, aiCol, 2);
          setBoard(aiBoard);
          setWinningCells(wCells);
          setGameOver(true);
          setScores(s => ({ ...s, p2: s.p2 + 1 }));
          setTimeout(() => Alert.alert('🤖 AI Wins!', 'The AI connects four!', [
            { text: 'Play Again', onPress: resetGame },
          ]), 300);
        } else {
          setBoard(aiBoard);
          setCurrentPlayer(1);
        }
      }, 600);
    }
  }, [board, currentPlayer, gameOver, vsAI, navigation]);

  const isWinning = (r: number, c: number) => winningCells.some(([wr, wc]) => wr === r && wc === c);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.pokerFelt} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔴 Connect Four</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.aiToggle, vsAI && styles.aiToggleActive]}
            onPress={() => { setVsAI(!vsAI); resetGame(); }}
          >
            <Text style={styles.aiToggleText}>{vsAI ? '🤖 AI' : '👥 2P'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetGame} style={styles.resetBtn}>
            <Ionicons name="refresh" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Score */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreCard}>
          <View style={[styles.scoreDot, { backgroundColor: PLAYER_COLORS[1] }]} />
          <Text style={styles.scorePlayerName}>{vsAI ? 'You' : 'Red'}</Text>
          <Text style={styles.scoreNum}>{scores.p1}</Text>
        </View>
        <View style={styles.vsDivider}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreNum}>{scores.p2}</Text>
          <Text style={styles.scorePlayerName}>{vsAI ? 'AI 🤖' : 'Yellow'}</Text>
          <View style={[styles.scoreDot, { backgroundColor: PLAYER_COLORS[2] }]} />
        </View>
      </View>

      {/* Turn indicator */}
      <View style={styles.turnRow}>
        <View style={[styles.turnDot, { backgroundColor: PLAYER_COLORS[currentPlayer] }]} />
        <Text style={styles.turnText}>
          {gameOver
            ? (isDraw ? "It's a Draw!" : '🏆 Game Over!')
            : `${vsAI && currentPlayer === 2 ? '🤖 AI' : currentPlayer === 1 ? 'Red' : 'Yellow'} plays`}
        </Text>
      </View>

      {/* Column drop buttons */}
      <View style={styles.dropButtonsRow}>
        {Array.from({ length: COLS }, (_, c) => (
          <TouchableOpacity
            key={c}
            style={[styles.dropBtn, { width: CELL_SIZE }]}
            onPress={() => dropPiece(c)}
            disabled={gameOver || getLowestRow(board, c) === -1}
          >
            <Ionicons
              name="caret-down"
              size={18}
              color={gameOver || getLowestRow(board, c) === -1 ? 'transparent' : PLAYER_COLORS[currentPlayer]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Board */}
      <View style={styles.boardContainer}>
        <View style={styles.board}>
          {board.map((row, r) => (
            <View key={r} style={styles.boardRow}>
              {row.map((cell, c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.cell, { width: CELL_SIZE, height: CELL_SIZE }]}
                  onPress={() => dropPiece(c)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.disc,
                    {
                      width: CELL_SIZE - 8,
                      height: CELL_SIZE - 8,
                      backgroundColor: cell === 0 ? 'rgba(255,255,255,0.12)' : PLAYER_COLORS[cell],
                      borderWidth: isWinning(r, c) ? 3 : 0,
                      borderColor: Colors.white,
                    },
                    isWinning(r, c) && styles.winningDisc,
                  ]} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={resetGame}>
          <Ionicons name="refresh" size={18} color={Colors.white} />
          <Text style={styles.actionBtnText}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.menuBtn]} onPress={() => navigation.goBack()}>
          <Ionicons name="grid" size={18} color={Colors.primary} />
          <Text style={[styles.actionBtnText, { color: Colors.primary }]}>Games</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1B2A1F' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: Colors.pokerFelt,
  },
  backBtn: { padding: 8 },
  headerTitle: { flex: 1, fontSize: FontSizes.xl, fontWeight: '800', color: Colors.white, textAlign: 'center' },
  headerRight: { flexDirection: 'row', gap: 8 },
  aiToggle: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  aiToggleActive: { backgroundColor: Colors.primary },
  aiToggleText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.sm },
  resetBtn: { padding: 8 },
  scoreBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, gap: 0,
  },
  scoreCard: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' },
  scoreDot: { width: 16, height: 16, borderRadius: 8 },
  scorePlayerName: { color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm, fontWeight: '600' },
  scoreNum: { color: Colors.white, fontSize: FontSizes.xxxl, fontWeight: '900' },
  vsDivider: { paddingHorizontal: 16 },
  vsText: { color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: FontSizes.sm },
  turnRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginBottom: Spacing.sm,
  },
  turnDot: { width: 14, height: 14, borderRadius: 7 },
  turnText: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '700' },
  dropButtonsRow: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 8, marginBottom: 4 },
  dropBtn: { alignItems: 'center', paddingVertical: 4 },
  boardContainer: { alignItems: 'center', paddingHorizontal: 8 },
  board: {
    backgroundColor: Colors.connectFourBlue, borderRadius: BorderRadius.lg,
    padding: 6, ...Shadow.large,
  },
  boardRow: { flexDirection: 'row' },
  cell: { padding: 4, alignItems: 'center', justifyContent: 'center' },
  disc: { borderRadius: 999 },
  winningDisc: {
    shadowColor: Colors.white, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 8, elevation: 8,
  },
  bottomActions: {
    flexDirection: 'row', gap: Spacing.md,
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary, paddingVertical: 12,
    borderRadius: BorderRadius.xl, ...Shadow.small,
  },
  menuBtn: { backgroundColor: Colors.white },
  actionBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
});
