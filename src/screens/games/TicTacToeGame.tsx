import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  StatusBar, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../../utils/theme';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 48, 360);
const CELL_SIZE = Math.floor(BOARD_SIZE / 3);

type Cell = '' | 'X' | 'O';
type Board = Cell[];
type WinLine = number[] | null;

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diags
];

function createBoard(): Board {
  return Array(9).fill('');
}

function checkWinner(board: Board): { winner: Cell; line: number[] } | null {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }
  return null;
}

function isBoardFull(board: Board): boolean {
  return board.every(cell => cell !== '');
}

function minimax(board: Board, isMaximizing: boolean, depth: number): number {
  const result = checkWinner(board);
  if (result) {
    return result.winner === 'O' ? 10 - depth : depth - 10;
  }
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        best = Math.max(best, minimax(board, false, depth + 1));
        board[i] = '';
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        best = Math.min(best, minimax(board, true, depth + 1));
        board[i] = '';
      }
    }
    return best;
  }
}

function getAIMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      const score = minimax(board, false, 0);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

export default function TicTacToeGame({ navigation }: any) {
  const [board, setBoard] = useState<Board>(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [vsAI, setVsAI] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [winLine, setWinLine] = useState<WinLine>(null);
  const [gameOver, setGameOver] = useState(false);
  const [statusText, setStatusText] = useState("X's turn");

  const resetGame = useCallback(() => {
    setBoard(createBoard());
    setCurrentPlayer('X');
    setWinLine(null);
    setGameOver(false);
    setStatusText("X's turn");
  }, []);

  const toggleMode = useCallback(() => {
    setVsAI(prev => !prev);
    setScores({ X: 0, O: 0, draw: 0 });
    setBoard(createBoard());
    setCurrentPlayer('X');
    setWinLine(null);
    setGameOver(false);
    setStatusText("X's turn");
  }, []);

  const processMove = useCallback((newBoard: Board, player: 'X' | 'O'): boolean => {
    const result = checkWinner(newBoard);
    if (result) {
      setWinLine(result.line);
      setGameOver(true);
      setScores(prev => ({ ...prev, [player]: prev[player as 'X' | 'O'] + 1 }));
      setStatusText(`${player} wins!`);
      return true;
    }
    if (isBoardFull(newBoard)) {
      setGameOver(true);
      setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
      setStatusText("It's a draw!");
      return true;
    }
    return false;
  }, []);

  const handlePress = useCallback((index: number) => {
    if (board[index] !== '' || gameOver) return;
    if (vsAI && currentPlayer === 'O') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    if (processMove(newBoard, currentPlayer)) return;

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
    setStatusText(`${nextPlayer}'s turn`);

    // AI move
    if (vsAI && nextPlayer === 'O') {
      setTimeout(() => {
        const aiBoard = [...newBoard];
        const aiMove = getAIMove(aiBoard);
        if (aiMove === -1) return;
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);
        if (processMove(aiBoard, 'O')) return;
        setCurrentPlayer('X');
        setStatusText("X's turn");
      }, 300);
    }
  }, [board, currentPlayer, gameOver, vsAI, processMove]);

  const isWinCell = (index: number) => winLine?.includes(index) ?? false;

  const getCellStyle = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      borderRightWidth: col < 2 ? 3 : 0,
      borderBottomWidth: row < 2 ? 3 : 0,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Tic-Tac-Toe</Text>
        <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
          <Ionicons name="refresh" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Mode Toggle */}
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, vsAI && styles.modeButtonActive]}
          onPress={() => { if (!vsAI) toggleMode(); }}
        >
          <Ionicons name="hardware-chip-outline" size={18} color={vsAI ? Colors.white : Colors.textSecondary} />
          <Text style={[styles.modeText, vsAI && styles.modeTextActive]}>vs AI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, !vsAI && styles.modeButtonActive]}
          onPress={() => { if (vsAI) toggleMode(); }}
        >
          <Ionicons name="people-outline" size={18} color={!vsAI ? Colors.white : Colors.textSecondary} />
          <Text style={[styles.modeText, !vsAI && styles.modeTextActive]}>2 Player</Text>
        </TouchableOpacity>
      </View>

      {/* Scoreboard */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreCard}>
          <Text style={[styles.scoreLabel, { color: '#FF6B6B' }]}>X</Text>
          <Text style={styles.scoreValue}>{scores.X}</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={[styles.scoreLabel, { color: Colors.textSecondary }]}>Draw</Text>
          <Text style={styles.scoreValue}>{scores.draw}</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={[styles.scoreLabel, { color: Colors.accentBlue }]}>O</Text>
          <Text style={styles.scoreValue}>{scores.O}</Text>
        </View>
      </View>

      {/* Status */}
      <Text style={[
        styles.status,
        gameOver && styles.statusGameOver,
      ]}>
        {statusText}
      </Text>

      {/* Board */}
      <View style={styles.boardWrapper}>
        <View style={styles.board}>
          {board.map((cell, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.cell,
                getCellStyle(index),
                isWinCell(index) && styles.winCell,
              ]}
              onPress={() => handlePress(index)}
              activeOpacity={0.7}
            >
              {cell === 'X' && (
                <Text style={[styles.cellText, styles.xText, isWinCell(index) && styles.winText]}>
                  X
                </Text>
              )}
              {cell === 'O' && (
                <Text style={[styles.cellText, styles.oText, isWinCell(index) && styles.winText]}>
                  O
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* New Game Button (visible when game over) */}
      {gameOver && (
        <TouchableOpacity style={styles.newGameButton} onPress={resetGame}>
          <Ionicons name="game-controller-outline" size={20} color={Colors.white} />
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.white,
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    marginTop: Spacing.md,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
    ...Shadow.small,
  },
  modeText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  modeTextActive: {
    color: Colors.white,
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.xl,
  },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: 80,
  },
  scoreLabel: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  scoreValue: {
    fontSize: FontSizes.xxxl,
    fontWeight: '800',
    color: Colors.white,
    marginTop: Spacing.xs,
  },
  status: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  statusGameOver: {
    color: Colors.accent,
    fontSize: FontSizes.xxl,
    fontWeight: '800',
  },
  boardWrapper: {
    padding: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: BorderRadius.xl,
    ...Shadow.large,
  },
  board: {
    width: CELL_SIZE * 3,
    height: CELL_SIZE * 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  winCell: {
    backgroundColor: 'rgba(107, 72, 255, 0.25)',
  },
  cellText: {
    fontSize: CELL_SIZE * 0.55,
    fontWeight: '800',
  },
  xText: {
    color: '#FF6B6B',
  },
  oText: {
    color: Colors.accentBlue,
  },
  winText: {
    textShadowColor: 'rgba(107, 72, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  newGameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xxl,
    ...Shadow.medium,
  },
  newGameText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.white,
  },
});
