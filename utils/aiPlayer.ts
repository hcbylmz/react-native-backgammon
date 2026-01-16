import { Point, Move } from '../types/game';
import { getLegalMovesFromBoard, getLegalMovesFromBar } from '../hooks/useMoveValidation';
import { canBearOff } from '../utils/gameLogic';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

interface AIGameState {
  boardPoints: Point[];
  currentPlayer: number;
  dice1: number;
  dice2: number;
  usedDice: number[];
  whiteBar: number;
  blackBar: number;
  whiteBorneOff: number;
  blackBorneOff: number;
}

const evaluatePosition = (state: AIGameState): number => {
  let score = 0;
  const player = state.currentPlayer;
  
  const playerBar = player > 0 ? state.whiteBar : state.blackBar;
  const opponentBar = player > 0 ? state.blackBar : state.whiteBar;
  const playerBorneOff = player > 0 ? state.whiteBorneOff : state.blackBorneOff;
  const opponentBorneOff = player > 0 ? state.blackBorneOff : state.whiteBorneOff;
  
  score += playerBorneOff * 10;
  score -= opponentBorneOff * 10;
  score -= playerBar * 5;
  score += opponentBar * 5;
  
  const homeBoardRange = player > 0 ? [1, 2, 3, 4, 5, 6] : [19, 20, 21, 22, 23, 24];
  
  state.boardPoints.forEach(point => {
    const checkerValue = point.checkers;
    if (Math.sign(checkerValue) === player && Math.abs(checkerValue) > 0) {
      if (homeBoardRange.includes(point.id)) {
        score += Math.abs(checkerValue) * 2;
      } else {
        score += Math.abs(checkerValue);
      }
    } else if (Math.sign(checkerValue) === -player && Math.abs(checkerValue) > 0) {
      if (homeBoardRange.includes(point.id)) {
        score -= Math.abs(checkerValue) * 2;
      } else {
        score -= Math.abs(checkerValue);
      }
    }
  });
  
  return score;
};

export const getAIMove = (
  state: AIGameState,
  difficulty: AIDifficulty,
  getLegalMovesFromBoardFn: typeof getLegalMovesFromBoard,
  getLegalMovesFromBarFn: typeof getLegalMovesFromBar
): Move | { from: null; to: number } | null => {
  const hasCrashed = state.currentPlayer > 0 ? state.whiteBar > 0 : state.blackBar > 0;
  
  let legalMoves: Array<Move | { from: null; to: number }> = [];
  
  if (hasCrashed) {
    const barMoves = getLegalMovesFromBarFn(
      state.dice1,
      state.dice2,
      state.usedDice,
      state.whiteBar,
      state.blackBar,
      state.boardPoints
    );
    legalMoves = barMoves.map(to => ({ from: null, to }));
  } else {
    const boardMoves = getLegalMovesFromBoardFn(
      state.dice1,
      state.dice2,
      state.usedDice,
      state.boardPoints
    );
    legalMoves = boardMoves;
  }
  
  if (legalMoves.length === 0) {
    return null;
  }
  
  if (difficulty === 'easy') {
    const randomIndex = Math.floor(Math.random() * legalMoves.length);
    return legalMoves[randomIndex];
  }
  
  if (difficulty === 'medium') {
    if (Math.random() < 0.3) {
      const randomIndex = Math.floor(Math.random() * legalMoves.length);
      return legalMoves[randomIndex];
    }
  }
  
  let bestMove: Move | { from: null; to: number } | null = null;
  let bestScore = -Infinity;
  
  for (const move of legalMoves) {
    const testState = {
      ...state,
      boardPoints: state.boardPoints.map(p => {
        if (move.from === null) {
          if (p.id === move.to) {
            return { ...p, checkers: p.checkers + (state.currentPlayer > 0 ? 1 : -1) };
          }
        } else {
          if (p.id === move.from) {
            return { ...p, checkers: p.checkers - (p.checkers > 0 ? 1 : -1) };
          }
          if (p.id === move.to) {
            return { ...p, checkers: p.checkers + (state.currentPlayer > 0 ? 1 : -1) };
          }
        }
        return p;
      }),
    };
    
    const score = evaluatePosition(testState);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
};
