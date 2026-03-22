import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  StatusBar, ScrollView, Alert, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../../utils/theme';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.floor((width - 32) / 8);

type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
type Color = 'w' | 'b';
type Piece = { type: PieceType; color: Color } | null;
type Board = Piece[][];
type Position = { row: number; col: number };

const PIECE_SYMBOLS: Record<string, string> = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

const initialBoard = (): Board => {
  const b: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  const backRank: PieceType[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  backRank.forEach((type, col) => {
    b[0][col] = { type, color: 'b' };
    b[7][col] = { type, color: 'w' };
  });
  for (let col = 0; col < 8; col++) {
    b[1][col] = { type: 'P', color: 'b' };
    b[6][col] = { type: 'P', color: 'w' };
  }
  return b;
};

function isValidMove(board: Board, from: Position, to: Position, color: Color): boolean {
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== color) return false;
  const target = board[to.row][to.col];
  if (target && target.color === color) return false;

  const dr = to.row - from.row;
  const dc = to.col - from.col;

  const pathClear = (rowStep: number, colStep: number): boolean => {
    let r = from.row + rowStep, c = from.col + colStep;
    while (r !== to.row || c !== to.col) {
      if (board[r][c] !== null) return false;
      r += rowStep; c += colStep;
    }
    return true;
  };

  switch (piece.type) {
    case 'P': {
      const dir = piece.color === 'w' ? -1 : 1;
      const startRow = piece.color === 'w' ? 6 : 1;
      if (dc === 0 && dr === dir && !target) return true;
      if (dc === 0 && dr === 2 * dir && from.row === startRow && !target && !board[from.row + dir][from.col]) return true;
      if (Math.abs(dc) === 1 && dr === dir && target && target.color !== piece.color) return true;
      return false;
    }
    case 'R': return (dr === 0 || dc === 0) && pathClear(Math.sign(dr), Math.sign(dc));
    case 'B': return Math.abs(dr) === Math.abs(dc) && pathClear(Math.sign(dr), Math.sign(dc));
    case 'Q': return (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) && pathClear(Math.sign(dr), Math.sign(dc));
    case 'N': return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    case 'K': return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
    default: return false;
  }
}

function getLegalMoves(board: Board, pos: Position, color: Color): Position[] {
  const moves: Position[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidMove(board, pos, { row: r, col: c }, color)) {
        moves.push({ row: r, col: c });
      }
    }
  }
  return moves;
}

// Simple AI: random legal move
function getAIMove(board: Board, color: Color): { from: Position; to: Position } | null {
  const pieces: Position[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === color) pieces.push({ row: r, col: c });
    }
  }

  // Prefer capturing moves
  const allMoves: { from: Position; to: Position; score: number }[] = [];
  pieces.forEach(from => {
    const moves = getLegalMoves(board, from, color);
    moves.forEach(to => {
      const target = board[to.row][to.col];
      const score = target ? (target.type === 'K' ? 1000 : target.type === 'Q' ? 9 : target.type === 'R' ? 5 : 3) : 0;
      allMoves.push({ from, to, score });
    });
  });

  if (allMoves.length === 0) return null;
  allMoves.sort((a, b) => b.score - a.score);
  // Pick randomly from top moves (with some randomness)
  const topMoves = allMoves.slice(0, Math.min(5, allMoves.length));
  const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];
  return chosen || null;
}

export default function ChessGame({ navigation }: any) {
  const [board, setBoard] = useState<Board>(initialBoard());
  const [selected, setSelected] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Position[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Color>('w');
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [vsAI, setVsAI] = useState(false);

  const resetGame = () => {
    setBoard(initialBoard());
    setSelected(null);
    setLegalMoves([]);
    setCurrentTurn('w');
    setCapturedWhite([]);
    setCapturedBlack([]);
    setMoveHistory([]);
    setGameOver(false);
  };

  const makeMove = useCallback((from: Position, to: Position, currentBoard: Board, currentColor: Color) => {
    const newBoard = currentBoard.map(r => [...r]);
    const piece = newBoard[from.row][from.col]!;
    const captured = newBoard[to.row][to.col];

    if (captured) {
      if (captured.color === 'w') setCapturedWhite(prev => [...prev, captured]);
      else setCapturedBlack(prev => [...prev, captured]);

      if (captured.type === 'K') {
        setBoard(newBoard);
        setGameOver(true);
        setTimeout(() => Alert.alert('Game Over!', `${currentColor === 'w' ? '⬜ White' : '⬛ Black'} wins! 🎉`, [
          { text: 'Play Again', onPress: resetGame },
          { text: 'Menu', onPress: () => navigation.goBack() },
        ]), 200);
        return newBoard;
      }
    }

    // Pawn promotion
    if (piece.type === 'P' && (to.row === 0 || to.row === 7)) {
      newBoard[to.row][to.col] = { type: 'Q', color: piece.color };
    } else {
      newBoard[to.row][to.col] = piece;
    }
    newBoard[from.row][from.col] = null;

    const cols = 'abcdefgh';
    const notation = `${PIECE_SYMBOLS[piece.color + piece.type]}${cols[from.col]}${8 - from.row}→${cols[to.col]}${8 - to.row}`;
    setMoveHistory(prev => [...prev, notation]);

    return newBoard;
  }, [navigation]);

  const handleSquarePress = (row: number, col: number) => {
    if (gameOver) return;

    const piece = board[row][col];

    if (selected) {
      const isLegal = legalMoves.some(m => m.row === row && m.col === col);
      if (isLegal) {
        const newBoard = makeMove(selected, { row, col }, board, currentTurn);
        setBoard(newBoard);
        setSelected(null);
        setLegalMoves([]);

        if (!gameOver) {
          const nextColor: Color = currentTurn === 'w' ? 'b' : 'w';
          setCurrentTurn(nextColor);

          if (vsAI && nextColor === 'b') {
            setTimeout(() => {
              const aiMove = getAIMove(newBoard, 'b');
              if (aiMove) {
                const aiBoard = makeMove(aiMove.from, aiMove.to, newBoard, 'b');
                setBoard(aiBoard);
                setCurrentTurn('w');
              }
            }, 500);
          }
        }
      } else if (piece && piece.color === currentTurn) {
        setSelected({ row, col });
        setLegalMoves(getLegalMoves(board, { row, col }, currentTurn));
      } else {
        setSelected(null);
        setLegalMoves([]);
      }
    } else {
      if (piece && piece.color === currentTurn) {
        setSelected({ row, col });
        setLegalMoves(getLegalMoves(board, { row, col }, currentTurn));
      }
    }
  };

  const isLegalTarget = (r: number, c: number) => legalMoves.some(m => m.row === r && m.col === c);
  const isSelected = (r: number, c: number) => selected?.row === r && selected?.col === c;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.chessDark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>♟ Chess</Text>
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

      <ScrollView contentContainerStyle={styles.content}>
        {/* Turn Indicator */}
        <View style={styles.turnBanner}>
          <View style={[styles.turnIndicator, { backgroundColor: currentTurn === 'w' ? '#F0D9B5' : '#1A1A2E' }]} />
          <Text style={styles.turnText}>
            {gameOver ? '🏆 Game Over' : `${currentTurn === 'w' ? '⬜ White' : '⬛ Black'}'s Turn`}
          </Text>
          {vsAI && currentTurn === 'b' && !gameOver && (
            <Text style={styles.aiThinking}>🤖 Thinking...</Text>
          )}
        </View>

        {/* Captured Black Pieces */}
        <View style={styles.capturedRow}>
          {capturedBlack.map((p, i) => p && (
            <Text key={i} style={styles.capturedPiece}>{PIECE_SYMBOLS['b' + p.type]}</Text>
          ))}
        </View>

        {/* Board */}
        <View style={styles.boardWrapper}>
          {/* Column labels */}
          <View style={styles.colLabels}>
            {'abcdefgh'.split('').map(l => (
              <Text key={l} style={[styles.label, { width: BOARD_SIZE }]}>{l}</Text>
            ))}
          </View>
          <View style={styles.boardRow}>
            {/* Row labels */}
            <View style={styles.rowLabels}>
              {[8, 7, 6, 5, 4, 3, 2, 1].map(n => (
                <Text key={n} style={[styles.label, { height: BOARD_SIZE, textAlignVertical: 'center' }]}>{n}</Text>
              ))}
            </View>
            <View style={styles.board}>
              {board.map((row, r) => (
                <View key={r} style={styles.row}>
                  {row.map((piece, c) => {
                    const isLight = (r + c) % 2 === 0;
                    const selected_ = isSelected(r, c);
                    const legal = isLegalTarget(r, c);
                    const sqColor = selected_ ? '#F6F669' : isLight ? Colors.chessLight : Colors.chessDark;
                    return (
                      <TouchableOpacity
                        key={c}
                        style={[styles.square, { width: BOARD_SIZE, height: BOARD_SIZE, backgroundColor: sqColor }]}
                        onPress={() => handleSquarePress(r, c)}
                        activeOpacity={0.85}
                      >
                        {legal && (
                          <View style={[styles.legalDot, piece ? styles.legalCapture : styles.legalMove]} />
                        )}
                        {piece && (
                          <Text style={[styles.piece, piece.color === 'w' ? styles.whitePiece : styles.blackPiece]}>
                            {PIECE_SYMBOLS[piece.color + piece.type]}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Captured White Pieces */}
        <View style={styles.capturedRow}>
          {capturedWhite.map((p, i) => p && (
            <Text key={i} style={styles.capturedPiece}>{PIECE_SYMBOLS['w' + p.type]}</Text>
          ))}
        </View>

        {/* Move History */}
        {moveHistory.length > 0 && (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Move History</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.historyText}>{moveHistory.slice(-10).join('  •  ')}</Text>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: Colors.chessDark,
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
  content: { alignItems: 'center', padding: Spacing.md },
  turnBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.full, marginBottom: 10,
  },
  turnIndicator: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  turnText: { fontSize: FontSizes.md, color: Colors.white, fontWeight: '700' },
  aiThinking: { fontSize: FontSizes.sm, color: Colors.accent },
  capturedRow: {
    flexDirection: 'row', flexWrap: 'wrap', minHeight: 24, marginVertical: 4, paddingHorizontal: 16,
  },
  capturedPiece: { fontSize: 18, opacity: 0.7 },
  boardWrapper: { alignItems: 'center' },
  colLabels: { flexDirection: 'row', marginLeft: 16 },
  boardRow: { flexDirection: 'row' },
  rowLabels: { width: 16 },
  label: {
    textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600',
  },
  board: { borderWidth: 2, borderColor: Colors.chessDark },
  row: { flexDirection: 'row' },
  square: { alignItems: 'center', justifyContent: 'center' },
  legalDot: { position: 'absolute', borderRadius: 999 },
  legalMove: { width: 24, height: 24, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 12 },
  legalCapture: {
    width: BOARD_SIZE - 4, height: BOARD_SIZE - 4,
    borderWidth: 3, borderColor: 'rgba(0,0,0,0.35)',
    backgroundColor: 'transparent', borderRadius: 4,
  },
  piece: { fontSize: BOARD_SIZE * 0.65 },
  whitePiece: { color: '#FFFDE7', textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  blackPiece: { color: '#1A1A2E', textShadowColor: 'rgba(255,255,255,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  historyCard: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginTop: Spacing.md, width: '100%',
  },
  historyTitle: { fontSize: FontSizes.sm, fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
  historyText: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.5)' },
});
