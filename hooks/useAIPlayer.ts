import { useState, useEffect } from 'react';
import { getAIMove, AIDifficulty } from '../utils/aiPlayer';
import { Point } from '../types/game';
import { useSettings } from './useSettings';

interface UseAIPlayerOptions {
  enabled: boolean;
  difficulty: AIDifficulty;
  currentPlayer: number;
  boardPoints: Point[];
  dice1: number;
  dice2: number;
  usedDice: number[];
  whiteBar: number;
  blackBar: number;
  whiteBorneOff: number;
  blackBorneOff: number;
  getLegalMovesFromBoard: any;
  getLegalMovesFromBar: any;
  onMove: (move: { from: number | null; to: number }) => void;
  gameEnded: boolean;
}

export const useAIPlayer = (options: UseAIPlayerOptions) => {
  const {
    enabled,
    difficulty,
    currentPlayer,
    boardPoints,
    dice1,
    dice2,
    usedDice,
    whiteBar,
    blackBar,
    whiteBorneOff,
    blackBorneOff,
    getLegalMovesFromBoard,
    getLegalMovesFromBar,
    onMove,
    gameEnded,
  } = options;

  const [isThinking, setIsThinking] = useState(false);
  const settings = useSettings();
  const aiDifficulty = (settings.settings?.theme === 'dark' ? 'hard' : difficulty) as AIDifficulty;

  useEffect(() => {
    if (!enabled || gameEnded || currentPlayer >= 0 || dice1 === 0 || dice2 === 0) {
      return;
    }

    const shouldMakeMove = currentPlayer < 0;
    if (!shouldMakeMove) return;

    setIsThinking(true);
    
    const delay = aiDifficulty === 'easy' ? 1000 : aiDifficulty === 'medium' ? 1500 : 2000;
    
    setTimeout(() => {
      const move = getAIMove(
        {
          boardPoints,
          currentPlayer,
          dice1,
          dice2,
          usedDice,
          whiteBar,
          blackBar,
          whiteBorneOff,
          blackBorneOff,
        },
        aiDifficulty,
        getLegalMovesFromBoard,
        getLegalMovesFromBar
      );

      if (move) {
        onMove(move);
      }
      
      setIsThinking(false);
    }, delay);
  }, [
    enabled,
    currentPlayer,
    dice1,
    dice2,
    usedDice,
    boardPoints,
    whiteBar,
    blackBar,
    gameEnded,
  ]);

  return { isThinking };
};
