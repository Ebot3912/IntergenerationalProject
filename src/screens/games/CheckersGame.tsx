import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  StatusBar, ScrollView, Alert, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../../utils/theme';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.floor((width - 32) / 8);

type PieceColor = 'r' | 'b'; // red or black
type CheckerPiece = { color: PieceColor; king: boolean } | null;
type Board = CheckerPiece[][];
type Position = { row: number; col: number };
type Move = { from: Position; to: Position; jumps: Position[] };

const CHECKER_RED = '#E74C3C';
const CHECKER_RED_KING = '#C0392B';
const CHECKER_BLACK = '#2C3E50';
const CHECKER_BLACK_KING = '#1A252F';
const BOARD_DARK = '#6B4226';
const BOARD_LIGHT = '#DEB887';
const HEADER_BG = '#4A2F1B';

const initialBoard = (): Board => {
  const b: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  // Black pieces on rows 0-2 (top)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        b[r][c] = { color: 'b', king: false };
      }
    }
  }
  // Red pieces on rows 5-7 (bottom)
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        b[r][c] = { color: 'r', king: false };
      }
    }
  }
  return b;
};

function getJumps(board: Board, pos: Position, color: PieceColor, isKing: boolean): Move[] {
  const moves: Move[] = [];
  const directions = isKing
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : color === 'r'
      ? [[-1, -1], [-1, 1]]
      : [[1, -1], [1, 1]];

  for (const [dr, dc] of directions) {
    const midR = pos.row + dr;
    const midC = pos.col + dc;
    const toR = pos.row + 2 * dr;
    const toC = pos.col + 2 * dc;

    if (toR < 0 || toR > 7 || toC < 0 || toC > 7) continue;
    const midPiece = board[midR][midC];
    if (!midPiece || midPiece.color === color) continue;
    if (board[toR][toC] !== null) continue;

    moves.push({
      from: pos,
      to: { row: toR, col: toC },
      jumps: [{ row: midR, col: midC }],
    });
  }
  return moves;
}

function getMultiJumps(board: Board, pos: Position, color: PieceColor, isKing: boolean): Move[] {
  const results: Move[] = [];

  function dfs(currentBoard: Board, currentPos: Position, currentKing: boolean, jumpsSoFar: Position[]) {
    const nextJumps = getJumps(currentBoard, currentPos, color, currentKing);
    if (nextJumps.length === 0 && jumpsSoFar.length > 0) {
      results.push({
        from: pos,
        to: currentPos,
        jumps: [...jumpsSoFar],
      });
      return;
    }

    for (const jump of nextJumps) {
      const newBoard = currentBoard.map(r => [...r]);
      newBoard[jump.jumps[0].row][jump.jumps[0].col] = null;
      newBoard[currentPos.row][currentPos.col] = null;
      const promoted = !currentKing && ((color === 'r' && jump.to.row === 0) || (color === 'b' && jump.to.row === 7));
      newBoard[jump.to.row][jump.to.col] = { color, king: currentKing || promoted };

      dfs(newBoard, jump.to, currentKing || promoted, [...jumpsSoFar, jump.jumps[0]]);
    }
  }

  dfs(board, pos, isKing, []);
  return results;
}

function getSimpleMoves(board: Board, pos: Position, color: PieceColor, isKing: boolean): Move[] {
  const moves: Move[] = [];
  const directions = isKing
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : color === 'r'
      ? [[-1, -1], [-1, 1]]
      : [[1, -1], [1, 1]];

  for (const [dr, dc] of directions) {
    const toR = pos.row + dr;
    const toC = pos.col + dc;
    if (toR < 0 || toR > 7 || toC < 0 || toC > 7) continue;
    if (board[toR][toC] !== null) continue;
    moves.push({ from: pos, to: { row: toR, col: toC }, jumps: [] });
  }
  return moves;
}

function getAllMovesForColor(board: Board, color: PieceColor): Move[] {
  const jumpMoves: Move[] = [];
  const simpleMoves: Move[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;
      const pos = { row: r, col: c };
      const multiJumps = getMultiJumps(board, pos, color, piece.king);
      jumpMoves.push(...multiJumps);
      simpleMoves.push(...getSimpleMoves(board, pos, color, piece.king));
    }
  }

  // Mandatory jumps: if any jump exists, only jumps are legal
  if (jumpMoves.length > 0) return jumpMoves;
  return simpleMoves;
}

function getMovesForPiece(board: Board, pos: Position, color: PieceColor): Move[] {
  const piece = board[pos.row][pos.col];
  if (!piece || piece.color !== color) return [];

  const allMoves = getAllMovesForColor(board, color);
  const hasJumps = allMoves.some(m => m.jumps.length > 0);

  // If jumps exist globally, only return jumps for this piece
  if (hasJumps) {
    return allMoves.filter(m => m.from.row === pos.row && m.from.col === pos.col && m.jumps.length > 0);
  }
  return allMoves.filter(m => m.from.row === pos.row && m.from.col === pos.col);
}

function countPieces(board: Board, color: PieceColor): number {
  let count = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === color) count++;
    }
  }
  return count;
}

function applyMove(board: Board, move: Move): Board {
  const newBoard = board.map(r => [...r]);
  const piece = newBoard[move.from.row][move.from.col]!;

  // Remove jumped pieces
  for (const jumped of move.jumps) {
    newBoard[jumped.row][jumped.col] = null;
  }

  newBoard[move.from.row][move.from.col] = null;

  // King promotion
  const promoted = !piece.king && ((piece.color === 'r' && move.to.row === 0) || (piece.color === 'b' && move.to.row === 7));
  newBoard[move.to.row][move.to.col] = { color: piece.color, king: piece.king || promoted };

  return newBoard;
}

function getAIMove(board: Board, color: PieceColor): Move | null {
  const allMoves = getAllMovesForColor(board, color);
  if (allMoves.length === 0) return null;

  // Prefer moves with the most jumps
  const maxJumps = Math.max(...allMoves.map(m => m.jumps.length));
  if (maxJumps > 0) {
    const bestJumps = allMoves.filter(m => m.jumps.length === maxJumps);
    return bestJumps[Math.floor(Math.random() * bestJumps.length)];
  }

  // Prefer king promotion moves
  const promotions = allMoves.filter(m => {
    const piece = board[m.from.row][m.from.col];
    if (!piece || piece.king) return false;
    return (color === 'r' && m.to.row === 0) || (color === 'b' && m.to.row === 7);
  });
  if (promotions.length > 0) {
    return promotions[Math.floor(Math.random() * promotions.length)];
  }

  // Prefer king moves (safer)
  const kingMoves = allMoves.filter(m => board[m.from.row][m.from.col]?.king);
  if (kingMoves.length > 0 && Math.random() > 0.4) {
    return kingMoves[Math.floor(Math.random() * kingMoves.length)];
  }

  return allMoves[Math.floor(Math.random() * allMoves.length)];
}

export default function CheckersGame({ navigation }: any) {
  const [board, setBoard] = useState<Board>(initialBoard());
  const [selected, setSelected] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('r');
  const [scoreRed, setScoreRed] = useState(0);
  const [scoreBlack, setScoreBlack] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [vsAI, setVsAI] = useState(false);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  const resetGame = useCallback(() => {
    setBoard(initialBoard());
    setSelected(null);
    setLegalMoves([]);
    setCurrentTurn('r');
    setGameOver(false);
    setLastMove(null);
  }, []);

  const checkGameOver = useCallback((newBoard: Board, nextColor: PieceColor) => {
    const nextMoves = getAllMovesForColor(newBoard, nextColor);
    const redCount = countPieces(newBoard, 'r');
    const blackCount = countPieces(newBoard, 'b');

    if (redCount === 0 || (nextColor === 'r' && nextMoves.length === 0)) {
      setGameOver(true);
      setScoreBlack(prev => prev + 1);
      setTimeout(() => Alert.alert('Game Over!', 'Black wins!', [
        { text: 'Play Again', onPress: resetGame },
        { text: 'Menu', onPress: () => navigation.goBack() },
      ]), 300);
      return true;
    }
    if (blackCount === 0 || (nextColor === 'b' && nextMoves.length === 0)) {
      setGameOver(true);
      setScoreRed(prev => prev + 1);
      setTimeout(() => Alert.alert('Game Over!', 'Red wins!', [
        { text: 'Play Again', onPress: resetGame },
        { text: 'Menu', onPress: () => navigation.goBack() },
      ]), 300);
      return true;
    }
    return false;
  }, [navigation, resetGame]);

  const executeMove = useCallback((move: Move, currentBoard: Board, color: PieceColor) => {
    const newBoard = applyMove(currentBoard, move);
    setBoard(newBoard);
    setLastMove(move);
    setSelected(null);
    setLegalMoves([]);

    const nextColor: PieceColor = color === 'r' ? 'b' : 'r';
    const isOver = checkGameOver(newBoard, nextColor);

    if (!isOver) {
      setCurrentTurn(nextColor);

      if (vsAI && nextColor === 'b') {
        setTimeout(() => {
          const aiMove = getAIMove(newBoard, 'b');
          if (aiMove) {
            const aiBoard = applyMove(newBoard, aiMove);
            setBoard(aiBoard);
            setLastMove(aiMove);
            const afterAI: PieceColor = 'r';
            if (!checkGameOver(aiBoard, afterAI)) {
              setCurrentTurn(afterAI);
            }
          }
        }, 500);
      }
    }
  }, [vsAI, checkGameOver]);

  const handleSquarePress = (row: number, col: number) => {
    if (gameOver) return;
    if (vsAI && currentTurn === 'b') return;

    const piece = board[row][col];

    if (selected) {
      // Check if tapped square is a legal move destination
      const matchingMove = legalMoves.find(m => m.to.row === row && m.to.col === col);
      if (matchingMove) {
        executeMove(matchingMove, board, currentTurn);
        return;
      }

      // Select a different piece
      if (piece && piece.color === currentTurn) {
        const moves = getMovesForPiece(board, { row, col }, currentTurn);
        if (moves.length > 0) {
          setSelected({ row, col });
          setLegalMoves(moves);
        } else {
          setSelected(null);
          setLegalMoves([]);
        }
        return;
      }

      // Deselect
      setSelected(null);
      setLegalMoves([]);
    } else {
      if (piece && piece.color === currentTurn) {
        const moves = getMovesForPiece(board, { row, col }, currentTurn);
        if (moves.length > 0) {
          setSelected({ row, col });
          setLegalMoves(moves);
        }
      }
    }
  };

  const isLegalTarget = (r: number, c: number) => legalMoves.some(m => m.to.row === r && m.to.col === c);
  const isSelected = (r: number, c: number) => selected?.row === r && selected?.col === c;
  const isLastMoveSquare = (r: number, c: number) =>
    lastMove && ((lastMove.from.row === r && lastMove.from.col === c) || (lastMove.to.row === r && lastMove.to.col === c));
  const hasJumpMoves = legalMoves.some(m => m.jumps.length > 0);

  // Highlight pieces that must jump
  const allCurrentMoves = getAllMovesForColor(board, currentTurn);
  const mustJump = allCurrentMoves.some(m => m.jumps.length > 0);
  const jumpablePieces = mustJump
    ? [...new Set(allCurrentMoves.filter(m => m.jumps.length > 0).map(m => `${m.from.row},${m.from.col}`))]
    : [];
  const isPieceJumpable = (r: number, c: number) => jumpablePieces.includes(`${r},${c}`);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkers</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.aiToggle, vsAI && styles.aiToggleActive]}
            onPress={() => { setVsAI(!vsAI); resetGame(); }}
          >
            <Text style={styles.aiToggleText}>{vsAI ? 'AI' : '2P'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetGame} style={styles.resetBtn}>
            <Ionicons name="refresh" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Score */}
        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <View style={[styles.scoreDot, { backgroundColor: CHECKER_RED }]} />
            <Text style={styles.scoreLabel}>Red</Text>
            <Text style={styles.scoreValue}>{scoreRed}</Text>
          </View>
          <View style={styles.turnBanner}>
            <View style={[styles.turnIndicator, { backgroundColor: currentTurn === 'r' ? CHECKER_RED : CHECKER_BLACK }]} />
            <Text style={styles.turnText}>
              {gameOver ? 'Game Over' : `${currentTurn === 'r' ? 'Red' : 'Black'}'s Turn`}
            </Text>
            {vsAI && currentTurn === 'b' && !gameOver && (
              <Text style={styles.aiThinking}>Thinking...</Text>
            )}
          </View>
          <View style={styles.scoreCard}>
            <View style={[styles.scoreDot, { backgroundColor: CHECKER_BLACK }]} />
            <Text style={styles.scoreLabel}>Black</Text>
            <Text style={styles.scoreValue}>{scoreBlack}</Text>
          </View>
        </View>

        {/* Piece counts */}
        <View style={styles.pieceCountRow}>
          <Text style={styles.pieceCountText}>
            {countPieces(board, 'r')} pieces
          </Text>
          <Text style={styles.pieceCountText}>
            {countPieces(board, 'b')} pieces
          </Text>
        </View>

        {mustJump && !gameOver && !selected && (
          <View style={styles.jumpWarning}>
            <Ionicons name="alert-circle" size={16} color={Colors.warning} />
            <Text style={styles.jumpWarningText}>Jump available - must jump!</Text>
          </View>
        )}

        {/* Board */}
        <View style={styles.boardWrapper}>
          <View style={styles.board}>
            {board.map((row, r) => (
              <View key={r} style={styles.row}>
                {row.map((piece, c) => {
                  const isDark = (r + c) % 2 === 1;
                  const sel = isSelected(r, c);
                  const legal = isLegalTarget(r, c);
                  const lastMv = isLastMoveSquare(r, c);
                  const jumpable = !sel && isPieceJumpable(r, c) && !gameOver && !(vsAI && currentTurn === 'b');

                  let sqColor = isDark ? BOARD_DARK : BOARD_LIGHT;
                  if (sel) sqColor = '#F6D64A';
                  else if (lastMv && isDark) sqColor = '#7B5B3A';
                  else if (jumpable) sqColor = '#8B5E3C';

                  return (
                    <TouchableOpacity
                      key={c}
                      style={[styles.square, { width: BOARD_SIZE, height: BOARD_SIZE, backgroundColor: sqColor }]}
                      onPress={() => handleSquarePress(r, c)}
                      activeOpacity={0.85}
                      disabled={!isDark && !piece}
                    >
                      {/* Legal move indicator */}
                      {legal && !piece && (
                        <View style={styles.legalDot} />
                      )}
                      {legal && piece && (
                        <View style={styles.legalCapture} />
                      )}

                      {/* Piece */}
                      {piece && (
                        <View style={[
                          styles.pieceOuter,
                          {
                            backgroundColor: piece.color === 'r' ? CHECKER_RED : CHECKER_BLACK,
                            borderColor: piece.color === 'r' ? '#C0392B' : '#1A252F',
                          },
                          jumpable && styles.pieceGlow,
                        ]}>
                          <View style={[
                            styles.pieceInner,
                            {
                              backgroundColor: piece.color === 'r' ? '#EF5350' : '#37474F',
                              borderColor: piece.color === 'r' ? '#FF8A80' : '#546E7A',
                            },
                          ]}>
                            {piece.king && (
                              <Text style={styles.crownText}>♛</Text>
                            )}
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to Play</Text>
          <Text style={styles.infoText}>
            Tap a piece to select, then tap a highlighted square to move. Pieces move diagonally. Jump over opponents to capture them. Jumps are mandatory. Reach the far side to become a King!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: HEADER_BG,
  },
  backBtn: { padding: 8 },
  headerTitle: {
    flex: 1, fontSize: FontSizes.xl, fontWeight: '800',
    color: Colors.white, textAlign: 'center',
  },
  headerRight: { flexDirection: 'row', gap: 8 },
  aiToggle: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  aiToggleActive: { backgroundColor: Colors.primary },
  aiToggleText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.sm },
  resetBtn: { padding: 8 },
  content: { alignItems: 'center', padding: Spacing.md },
  scoreRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', marginBottom: Spacing.sm,
  },
  scoreCard: {
    alignItems: 'center', gap: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md, minWidth: 70,
  },
  scoreDot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  scoreLabel: { fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  scoreValue: { fontSize: FontSizes.xl, color: Colors.white, fontWeight: '800' },
  turnBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  turnIndicator: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  turnText: { fontSize: FontSizes.md, color: Colors.white, fontWeight: '700' },
  aiThinking: { fontSize: FontSizes.sm, color: Colors.accent },
  pieceCountRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    width: '100%', paddingHorizontal: Spacing.xl, marginBottom: Spacing.sm,
  },
  pieceCountText: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.4)' },
  jumpWarning: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full, marginBottom: Spacing.sm,
  },
  jumpWarningText: { fontSize: FontSizes.sm, color: Colors.warning, fontWeight: '600' },
  boardWrapper: {
    alignItems: 'center',
    ...Shadow.large,
  },
  board: {
    borderWidth: 3, borderColor: HEADER_BG,
    borderRadius: 4, overflow: 'hidden',
  },
  row: { flexDirection: 'row' },
  square: { alignItems: 'center', justifyContent: 'center' },
  legalDot: {
    position: 'absolute', width: 20, height: 20,
    borderRadius: 10, backgroundColor: 'rgba(76,175,80,0.5)',
    zIndex: 1,
  },
  legalCapture: {
    position: 'absolute',
    width: BOARD_SIZE - 4, height: BOARD_SIZE - 4,
    borderWidth: 3, borderColor: 'rgba(76,175,80,0.6)',
    backgroundColor: 'transparent', borderRadius: BOARD_SIZE / 2,
    zIndex: 1,
  },
  pieceOuter: {
    width: BOARD_SIZE * 0.78, height: BOARD_SIZE * 0.78,
    borderRadius: BOARD_SIZE * 0.39,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    ...Shadow.small,
  },
  pieceInner: {
    width: BOARD_SIZE * 0.58, height: BOARD_SIZE * 0.58,
    borderRadius: BOARD_SIZE * 0.29,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  pieceGlow: {
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
  crownText: {
    fontSize: BOARD_SIZE * 0.32,
    color: '#FFD700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginTop: Spacing.lg, width: '100%',
  },
  infoTitle: {
    fontSize: FontSizes.sm, fontWeight: '700',
    color: 'rgba(255,255,255,0.7)', marginBottom: 6,
  },
  infoText: {
    fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.5)',
    lineHeight: 20,
  },
});
