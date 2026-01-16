import { useState, useCallback } from 'react';
import { Point } from '../types/game';

interface GameStateSnapshot {
  boardPoints: Point[];
  whiteBar: number;
  blackBar: number;
  whiteBorneOff: number;
  blackBorneOff: number;
  currentPlayer: number;
  dice1: number;
  dice2: number;
  usedDice: number[];
}

interface MoveRecord {
  from: number | null;
  to: number;
  player: number;
  moveNumber: number;
  snapshot: GameStateSnapshot;
}

export const useMoveHistory = () => {
  const [history, setHistory] = useState<MoveRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addMove = useCallback((
    from: number | null,
    to: number,
    player: number,
    snapshot: GameStateSnapshot
  ) => {
    const newMove: MoveRecord = {
      from,
      to,
      player,
      moveNumber: history.length + 1,
      snapshot,
    };
    
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newMove);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  const undo = useCallback((): GameStateSnapshot | null => {
    if (currentIndex < 0) return null;
    
    const previousIndex = currentIndex - 1;
    setCurrentIndex(previousIndex);
    
    if (previousIndex >= 0) {
      return history[previousIndex].snapshot;
    }
    
    return null;
  }, [history, currentIndex]);

  const canUndo = currentIndex >= 0;

  const getHistory = useCallback(() => {
    return history.map(move => ({
      from: move.from,
      to: move.to,
      player: move.player,
      moveNumber: move.moveNumber,
    }));
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    addMove,
    undo,
    canUndo,
    getHistory,
    clearHistory,
  };
};
