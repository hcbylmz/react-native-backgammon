import Toast from 'react-native-toast-message';
import { isPointOpenForEntry, canMove, canBearOff } from '../utils/gameLogic';
import { calculateTargetPoint, calculateEntryPoint } from '../utils/boardUtils';
import { useGameState } from './useGameState';
import { useDice } from './useDice';
import { useMoveValidation } from './useMoveValidation';
import * as soundManager from '../utils/soundManager';
import * as hapticFeedback from '../utils/hapticFeedback';

export const usePointHandlers = (
  gameState: ReturnType<typeof useGameState>,
  dice: ReturnType<typeof useDice>,
  moveValidation: ReturnType<typeof useMoveValidation>,
  moveHistory?: ReturnType<typeof import('./useMoveHistory').useMoveHistory>
) => {
  const handleBearingOffPress = () => {
    if (gameState.gameEnded) return;
    if (!moveValidation.canBearingOff()) return;
    
    if (gameState.selectedPointId === null) return;
    
    const fromPoint = gameState.boardPoints.find(p => p.id === gameState.selectedPointId);
    if (!fromPoint || fromPoint.checkers === 0 || Math.sign(fromPoint.checkers) !== gameState.currentPlayer) {
      return;
    }
    
    const availableDice = dice.getAvailableDice();
    if (availableDice.length === 0) return;
    
    const homeBoardRange = gameState.currentPlayer > 0 ? [1, 2, 3, 4, 5, 6] : [19, 20, 21, 22, 23, 24];
    if (!homeBoardRange.includes(gameState.selectedPointId)) return;
    
    const pointValue = gameState.currentPlayer > 0 
      ? gameState.selectedPointId 
      : 25 - gameState.selectedPointId;
    
    let diceToUse: number | null = null;
    
    for (const diceValue of availableDice) {
      if (canBearOff(
        gameState.selectedPointId, 
        diceValue, 
        gameState.currentPlayer, 
        gameState.boardPoints,
        gameState.whiteBar,
        gameState.blackBar
      )) {
        if (diceValue === pointValue) {
          diceToUse = diceValue;
          break;
        }
        if (diceToUse === null || diceValue > diceToUse) {
          diceToUse = diceValue;
        }
      }
    }
    
    if (diceToUse !== null) {
      const fromPointId = gameState.selectedPointId;
      gameState.bearOffChecker(fromPointId);
      gameState.setSelectedPointId(null);
      dice.markDiceAsUsed([diceToUse]);
      soundManager.playMoveSound();
      hapticFeedback.triggerMoveHaptic();
      
      if (moveHistory) {
        moveHistory.addMove(
          fromPointId,
          -1,
          gameState.currentPlayer,
          {
            boardPoints: [...gameState.boardPoints],
            whiteBar: gameState.whiteBar,
            blackBar: gameState.blackBar,
            whiteBorneOff: gameState.whiteBorneOff,
            blackBorneOff: gameState.blackBorneOff,
            currentPlayer: gameState.currentPlayer,
            dice1: dice.dice1,
            dice2: dice.dice2,
            usedDice: [...dice.usedDice, diceToUse],
          }
        );
      }
      
      if (dice.allDiceUsed()) {
        gameState.switchPlayer();
      } else {
        checkRemainingMoves();
      }
    }
  };

  const handlePointPress = (pointId: number) => {
    if (gameState.gameEnded) return;
    
    const forcedMove = moveValidation.getForcedMoveInfo();
    if (forcedMove) {
      if (forcedMove.from === -1) {
        if (pointId === forcedMove.to) {
          const point = gameState.boardPoints.find(p => p.id === pointId);
          if (!point) return;
          const isHittingBlot = point.checkers !== 0 && 
            Math.sign(point.checkers) !== gameState.currentPlayer &&
            Math.abs(point.checkers) === 1;
          gameState.moveChecker(null, pointId, true, isHittingBlot, point.checkers);
          gameState.setSelectedFromBar(false);
          dice.markDiceAsUsed([forcedMove.diceValue]);
          if (dice.allDiceUsed()) {
            gameState.switchPlayer();
          } else {
            checkRemainingMoves();
          }
        }
      } else {
        if (gameState.selectedPointId === forcedMove.from && pointId === forcedMove.to) {
          const fromPoint = gameState.boardPoints.find(p => p.id === forcedMove.from);
          const toPoint = gameState.boardPoints.find(p => p.id === forcedMove.to);
          if (!fromPoint || !toPoint) return;
          const isHittingBlot = toPoint.checkers !== 0 && 
            Math.sign(toPoint.checkers) !== gameState.currentPlayer &&
            Math.abs(toPoint.checkers) === 1;
          gameState.moveChecker(forcedMove.from, forcedMove.to, false, isHittingBlot, toPoint.checkers);
          gameState.setSelectedPointId(null);
          dice.markDiceAsUsed([forcedMove.diceValue]);
          if (dice.allDiceUsed()) {
            gameState.switchPlayer();
          } else {
            checkRemainingMoves();
          }
        } else if (pointId === forcedMove.from) {
          gameState.setSelectedPointId(pointId);
        }
      }
      return;
    }
    
    const point = gameState.boardPoints.find(p => p.id === pointId);
    if (!point) return;

    const hasCrashed = gameState.hasCrashedPieces(gameState.currentPlayer);

    if (hasCrashed && !gameState.selectedFromBar) {
      return;
    }

    if (gameState.selectedFromBar) {
      const availableDice = dice.getAvailableDice();
      const diceUsed = availableDice.find(d => calculateEntryPoint(d, gameState.currentPlayer) === pointId);
      
      if (diceUsed && isPointOpenForEntry(pointId, gameState.currentPlayer, gameState.boardPoints)) {
        const isHittingBlot = point.checkers !== 0 && 
          Math.sign(point.checkers) !== gameState.currentPlayer &&
          Math.abs(point.checkers) === 1;
        
        gameState.moveChecker(null, pointId, true, isHittingBlot, point.checkers);
        gameState.setSelectedFromBar(false);
        dice.markDiceAsUsed([diceUsed]);
        if (isHittingBlot) {
          soundManager.playHitSound();
          hapticFeedback.triggerHitHaptic();
        } else {
          soundManager.playMoveSound();
          hapticFeedback.triggerMoveHaptic();
        }
        
        if (moveHistory) {
          moveHistory.addMove(
            null,
            pointId,
            gameState.currentPlayer,
            {
              boardPoints: [...gameState.boardPoints],
              whiteBar: gameState.whiteBar,
              blackBar: gameState.blackBar,
              whiteBorneOff: gameState.whiteBorneOff,
              blackBorneOff: gameState.blackBorneOff,
              currentPlayer: gameState.currentPlayer,
              dice1: dice.dice1,
              dice2: dice.dice2,
              usedDice: [...dice.usedDice, diceUsed],
            }
          );
        }
        
        if (dice.allDiceUsed()) {
          gameState.switchPlayer();
        } else {
          checkRemainingMoves();
        }
      }
      return;
    }

    if (gameState.selectedPointId !== null) {
      if (gameState.selectedPointId === pointId) {
        gameState.setSelectedPointId(null);
        return;
      }

      const fromPoint = gameState.boardPoints.find(p => p.id === gameState.selectedPointId);
      if (!fromPoint) return;

      const distance = gameState.currentPlayer > 0
        ? gameState.selectedPointId - pointId
        : pointId - gameState.selectedPointId;
      
      if (distance <= 0) {
        gameState.setSelectedPointId(null);
        if (point.checkers !== 0 && Math.sign(point.checkers) === gameState.currentPlayer && !hasCrashed) {
          gameState.setSelectedPointId(pointId);
        }
        return;
      }
      
      const isBearingOffPossible = moveValidation.canBearingOff();
      
      if (isBearingOffPossible) {
        const homeBoardRange = gameState.currentPlayer > 0 ? [1, 2, 3, 4, 5, 6] : [19, 20, 21, 22, 23, 24];
        if (homeBoardRange.includes(gameState.selectedPointId) && pointId === -1) {
          handleBearingOffPress();
          return;
        }
      }
      
      const availableDice = dice.getAvailableDice();
      let diceToUse: number[] = [];
      let isValidMove = false;
      
      if (dice.dice1 === dice.dice2 && dice.dice1 > 0) {
        const diceValue = dice.dice1;
        const usedCount = dice.usedDice.filter(d => d === diceValue).length;
        const remainingMoves = 4 - usedCount;
        
        if (distance % diceValue === 0) {
          const movesNeeded = distance / diceValue;
          if (movesNeeded > 0 && movesNeeded <= remainingMoves) {
            isValidMove = true;
            for (let i = 0; i < movesNeeded; i++) {
              diceToUse.push(diceValue);
            }
          }
        }
      } else {
        const diceUsed = availableDice.find(d => d === distance);
        if (diceUsed) {
          isValidMove = true;
          diceToUse.push(diceUsed);
        }
      }
      
      const destinationPoint = gameState.boardPoints.find(p => p.id === pointId);
      const isHittingBlot = destinationPoint && 
        destinationPoint.checkers !== 0 && 
        Math.sign(destinationPoint.checkers) !== gameState.currentPlayer &&
        Math.abs(destinationPoint.checkers) === 1;
      
      if (isValidMove && fromPoint && destinationPoint) {
        if (canMove(fromPoint, destinationPoint, gameState.currentPlayer)) {
          const fromId = gameState.selectedPointId;
          gameState.moveChecker(fromId, pointId, false, isHittingBlot, destinationPoint.checkers);
          gameState.setSelectedPointId(null);
          dice.markDiceAsUsed(diceToUse);
          if (isHittingBlot) {
            soundManager.playHitSound();
            hapticFeedback.triggerHitHaptic();
          } else {
            soundManager.playMoveSound();
            hapticFeedback.triggerMoveHaptic();
          }
          
          if (moveHistory) {
            moveHistory.addMove(
              fromId,
              pointId,
              gameState.currentPlayer,
              {
                boardPoints: [...gameState.boardPoints],
                whiteBar: gameState.whiteBar,
                blackBar: gameState.blackBar,
                whiteBorneOff: gameState.whiteBorneOff,
                blackBorneOff: gameState.blackBorneOff,
                currentPlayer: gameState.currentPlayer,
                dice1: dice.dice1,
                dice2: dice.dice2,
                usedDice: [...dice.usedDice, ...diceToUse],
              }
            );
          }
          
          if (dice.allDiceUsed()) {
            gameState.switchPlayer();
          } else {
            checkRemainingMoves();
          }
        } else {
          trySelectPoint(point, hasCrashed);
        }
      } else {
        trySelectPoint(point, hasCrashed);
      }
    } else {
      trySelectPoint(point, hasCrashed);
    }
  };

  const trySelectPoint = (point: typeof gameState.boardPoints[0], hasCrashed: boolean) => {
    gameState.setSelectedPointId(null);
    if (point.checkers !== 0 && Math.sign(point.checkers) === gameState.currentPlayer && !hasCrashed) {
      gameState.setSelectedPointId(point.id);
    }
  };

  const checkRemainingMoves = () => {
    setTimeout(() => {
      const stillHasCrashed = gameState.hasCrashedPieces(gameState.currentPlayer);
      const remainingDice = dice.getAvailableDiceAfterMove(dice.usedDice);
      const isBearingOffMode = moveValidation.canBearingOff();
      
      if (stillHasCrashed) {
        const legalMovesFromBar = moveValidation.getLegalMovesFromBar(
          dice.dice1, 
          dice.dice2, 
          dice.usedDice, 
          gameState.whiteBar, 
          gameState.blackBar, 
          gameState.boardPoints
        );
        if (legalMovesFromBar.length === 0 && remainingDice.length > 0) {
          showNoLegalMovesToast();
        }
      } else if (isBearingOffMode) {
        const hasBearingOffMoves = gameState.boardPoints.some(point => {
          if (point.checkers === 0 || Math.sign(point.checkers) !== gameState.currentPlayer) {
            return false;
          }
          const homeBoardRange = gameState.currentPlayer > 0 ? [1, 2, 3, 4, 5, 6] : [19, 20, 21, 22, 23, 24];
          if (!homeBoardRange.includes(point.id)) return false;
          
          return remainingDice.some(diceValue => 
            canBearOff(
              point.id, 
              diceValue, 
              gameState.currentPlayer, 
              gameState.boardPoints,
              gameState.whiteBar,
              gameState.blackBar
            )
          );
        });
        
        if (!hasBearingOffMoves && remainingDice.length > 0) {
          showNoLegalMovesToast();
        }
      } else {
        const legalMovesFromBoard = moveValidation.getLegalMovesFromBoard(
          dice.dice1, 
          dice.dice2, 
          dice.usedDice, 
          gameState.boardPoints
        );
        if (legalMovesFromBoard.length === 0 && remainingDice.length > 0) {
          showNoLegalMovesToast();
        }
      }
    }, 150);
  };

  const showNoLegalMovesToast = () => {
    Toast.show({
      type: 'info',
      text1: 'No Legal Moves Available',
      text2: `${gameState.currentPlayer > 0 ? 'White' : 'Black'} cannot make any moves. Turn passes to opponent.`,
      position: 'bottom',
      visibilityTime: 3000,
    });
    setTimeout(() => {
      gameState.switchPlayer();
    }, 500);
  };

  return { handlePointPress, handleBearingOffPress };
};
