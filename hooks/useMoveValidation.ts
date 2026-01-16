import { Point, Move } from '../types/game';
import { canMove, isPointOpenForEntry, isAllCheckersInHomeBoard, canBearOff, getForcedMove } from '../utils/gameLogic';
import { calculateTargetPoint, calculateEntryPoint } from '../utils/boardUtils';

interface UseMoveValidationParams {
  boardPoints: Point[];
  currentPlayer: number;
  dice1: number;
  dice2: number;
  usedDice: number[];
  whiteBar: number;
  blackBar: number;
  whiteBorneOff?: number;
  blackBorneOff?: number;
}

export const useMoveValidation = ({
  boardPoints,
  currentPlayer,
  dice1,
  dice2,
  usedDice,
  whiteBar,
  blackBar,
  whiteBorneOff = 0,
  blackBorneOff = 0,
}: UseMoveValidationParams) => {
  const getLegalMovesFromBar = (
    dice1Override?: number,
    dice2Override?: number,
    usedDiceOverride?: number[],
    whiteBarOverride?: number,
    blackBarOverride?: number,
    boardPointsOverride?: Point[]
  ): number[] => {
    const wBar = whiteBarOverride !== undefined ? whiteBarOverride : whiteBar;
    const bBar = blackBarOverride !== undefined ? blackBarOverride : blackBar;
    const playerBar = currentPlayer > 0 ? wBar : bBar;
    const points = boardPointsOverride !== undefined ? boardPointsOverride : boardPoints;
    
    if (playerBar === 0) return [];
    
    const d1 = dice1Override !== undefined ? dice1Override : dice1;
    const d2 = dice2Override !== undefined ? dice2Override : dice2;
    const used = usedDiceOverride !== undefined ? usedDiceOverride : usedDice;
    
    if (d1 === 0 || d2 === 0) return [];
    
    const available: number[] = [];
    if (d1 === d2) {
      const total = 4;
      const usedCount = used.filter(d => d === d1).length;
      const remaining = total - usedCount;
      for (let i = 0; i < remaining; i++) {
        available.push(d1);
      }
    } else {
      const used1 = used.filter(d => d === d1).length;
      const used2 = used.filter(d => d === d2).length;
      if (used1 === 0) available.push(d1);
      if (used2 === 0) available.push(d2);
    }
    
    const legalMoves: number[] = [];
    
    available.forEach(diceValue => {
      const targetPointId = calculateEntryPoint(diceValue, currentPlayer);
      
      if (targetPointId >= 1 && targetPointId <= 24) {
        const targetPoint = points.find(p => p.id === targetPointId);
        if (targetPoint && isPointOpenForEntry(targetPointId, currentPlayer, points)) {
          legalMoves.push(targetPointId);
        }
      }
    });
    
    return legalMoves;
  };

  const getLegalMovesFromBoard = (
    dice1Override?: number,
    dice2Override?: number,
    usedDiceOverride?: number[],
    boardPointsOverride?: Point[]
  ): Move[] => {
    const legalMoves: Move[] = [];
    const points = boardPointsOverride !== undefined ? boardPointsOverride : boardPoints;
    
    const d1 = dice1Override !== undefined ? dice1Override : dice1;
    const d2 = dice2Override !== undefined ? dice2Override : dice2;
    const used = usedDiceOverride !== undefined ? usedDiceOverride : usedDice;
    
    if (d1 === 0 || d2 === 0) return [];
    
    const available: number[] = [];
    if (d1 === d2) {
      const total = 4;
      const usedCount = used.filter(d => d === d1).length;
      const remaining = total - usedCount;
      for (let i = 0; i < remaining; i++) {
        available.push(d1);
      }
    } else {
      const used1 = used.filter(d => d === d1).length;
      const used2 = used.filter(d => d === d2).length;
      if (used1 === 0) available.push(d1);
      if (used2 === 0) available.push(d2);
    }
    
    points.forEach(fromPoint => {
      if (fromPoint.checkers === 0 || Math.sign(fromPoint.checkers) !== currentPlayer) {
        return;
      }
      
      available.forEach(diceValue => {
        const targetPointId = calculateTargetPoint(fromPoint.id, diceValue, currentPlayer);
        
        if (targetPointId >= 1 && targetPointId <= 24) {
          const targetPoint = points.find(p => p.id === targetPointId);
          if (targetPoint && canMove(fromPoint, targetPoint, currentPlayer)) {
            legalMoves.push({ from: fromPoint.id, to: targetPointId });
          }
        }
      });
    });
    
    return legalMoves;
  };

  const getAvailableDestinations = (
    selectedPointId: number | null,
    selectedFromBar: boolean,
    getAvailableDice: () => number[]
  ): number[] => {
    if (selectedFromBar) {
      return getLegalMovesFromBar();
    }
    
    if (selectedPointId === null) return [];
    
    const fromPoint = boardPoints.find(p => p.id === selectedPointId);
    if (!fromPoint || fromPoint.checkers === 0) return [];
    
    const isBearingOffMode = canBearingOff();
    
    if (isBearingOffMode) {
      const homeBoardRange = currentPlayer > 0 ? [1, 2, 3, 4, 5, 6] : [19, 20, 21, 22, 23, 24];
      if (homeBoardRange.includes(selectedPointId)) {
        const canBearOffFromThisPoint = getBearingOffDestinations(selectedPointId, getAvailableDice);
        if (canBearOffFromThisPoint) {
          return [-1];
        }
      }
      return [];
    }
    
    const availableDice = getAvailableDice();
    const destinations: number[] = [];
    
    if (dice1 === dice2 && dice1 > 0) {
      const diceValue = dice1;
      const usedCount = usedDice.filter(d => d === diceValue).length;
      const remainingMoves = 4 - usedCount;
      
      for (let moveCount = 1; moveCount <= remainingMoves; moveCount++) {
        const totalDistance = diceValue * moveCount;
        const targetPointId = calculateTargetPoint(selectedPointId, totalDistance, currentPlayer);
        
        if (targetPointId >= 1 && targetPointId <= 24) {
          const targetPoint = boardPoints.find(p => p.id === targetPointId);
          if (targetPoint && canMove(fromPoint, targetPoint, currentPlayer)) {
            if (!destinations.includes(targetPointId)) {
              destinations.push(targetPointId);
            }
          }
        }
      }
    } else {
      availableDice.forEach(diceValue => {
        const targetPointId = calculateTargetPoint(selectedPointId, diceValue, currentPlayer);
        
        if (targetPointId >= 1 && targetPointId <= 24) {
          const targetPoint = boardPoints.find(p => p.id === targetPointId);
          if (targetPoint && canMove(fromPoint, targetPoint, currentPlayer)) {
            destinations.push(targetPointId);
          }
        }
      });
    }
    
    return destinations;
  };

  const canBearingOff = (): boolean => {
    return isAllCheckersInHomeBoard(currentPlayer, boardPoints, whiteBar, blackBar);
  };

  const getBearingOffDestinations = (
    selectedPointId: number | null,
    getAvailableDice: () => number[]
  ): boolean => {
    if (!canBearingOff() || selectedPointId === null) return false;
    
    const fromPoint = boardPoints.find(p => p.id === selectedPointId);
    if (!fromPoint || fromPoint.checkers === 0 || Math.sign(fromPoint.checkers) !== currentPlayer) {
      return false;
    }
    
    const homeBoardRange = currentPlayer > 0 ? [1, 2, 3, 4, 5, 6] : [19, 20, 21, 22, 23, 24];
    if (!homeBoardRange.includes(selectedPointId)) return false;
    
    const availableDice = getAvailableDice();
    if (availableDice.length === 0) return false;
    
    return availableDice.some(diceValue => 
      canBearOff(selectedPointId, diceValue, currentPlayer, boardPoints, whiteBar, blackBar)
    );
  };

  const getForcedMoveInfo = (): { from: number; to: number; diceValue: number } | null => {
    return getForcedMove(
      dice1,
      dice2,
      currentPlayer,
      boardPoints,
      whiteBar,
      blackBar,
      usedDice
    );
  };

  const getBestMoveHint = (): Move | null => {
    const legalMoves = getLegalMovesFromBoard();
    if (legalMoves.length === 0) {
      const barMoves = getLegalMovesFromBar();
      if (barMoves.length > 0) {
        return { from: -1, to: barMoves[0] };
      }
      return null;
    }
    
    return legalMoves[0];
  };

  return {
    getLegalMovesFromBar,
    getLegalMovesFromBoard,
    getAvailableDestinations,
    canBearingOff,
    getBearingOffDestinations,
    getForcedMoveInfo,
    getBestMoveHint,
  };
};
