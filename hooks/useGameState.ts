import { useState, useMemo, useRef, useEffect } from 'react';
import { Point, GameResultType, GameScore } from '../types/game';
import { getInitialPoints, detectGammon, detectBackgammon } from '../utils/gameLogic';

export const useGameState = (initialPoints?: Point[]) => {
  const points = useMemo(() => getInitialPoints(initialPoints), [initialPoints]);
  
  const [boardPoints, setBoardPoints] = useState<Point[]>(initialPoints || points);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [whiteBar, setWhiteBar] = useState<number>(0);
  const [blackBar, setBlackBar] = useState<number>(0);
  const [whiteBorneOff, setWhiteBorneOff] = useState<number>(0);
  const [blackBorneOff, setBlackBorneOff] = useState<number>(0);
  const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
  const [selectedFromBar, setSelectedFromBar] = useState<boolean>(false);
  const [gameStartTime] = useState<number>(Date.now());
  const moveCountRef = useRef<number>(0);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [gameResultType, setGameResultType] = useState<GameResultType>('normal');
  const [cubeValue, setCubeValue] = useState<number>(1);

  useEffect(() => {
    if (whiteBorneOff === 15) {
      setGameEnded(true);
      setWinner(1);
      const isGammon = detectGammon(1, whiteBorneOff, blackBorneOff);
      const isBackgammon = detectBackgammon(1, boardPoints, whiteBar, blackBar);
      if (isBackgammon) {
        setGameResultType('backgammon');
      } else if (isGammon) {
        setGameResultType('gammon');
      } else {
        setGameResultType('normal');
      }
    } else if (blackBorneOff === 15) {
      setGameEnded(true);
      setWinner(-1);
      const isGammon = detectGammon(-1, whiteBorneOff, blackBorneOff);
      const isBackgammon = detectBackgammon(-1, boardPoints, whiteBar, blackBar);
      if (isBackgammon) {
        setGameResultType('backgammon');
      } else if (isGammon) {
        setGameResultType('gammon');
      } else {
        setGameResultType('normal');
      }
    }
  }, [whiteBorneOff, blackBorneOff, boardPoints, whiteBar, blackBar]);

  const resetGame = () => {
    setBoardPoints([...points]);
    setSelectedPointId(null);
    setCurrentPlayer(1);
    setWhiteBar(0);
    setBlackBar(0);
    setWhiteBorneOff(0);
    setBlackBorneOff(0);
    setSelectedFromBar(false);
    setGameEnded(false);
    setWinner(null);
    setGameResultType('normal');
    setCubeValue(1);
    moveCountRef.current = 0;
  };

  const hasCrashedPieces = (player: number): boolean => {
    if (player > 0) {
      return whiteBar > 0;
    } else {
      return blackBar > 0;
    }
  };

  const switchPlayer = () => {
    setCurrentPlayer(prev => -prev);
  };

  const moveChecker = (
    fromPointId: number | null,
    toPointId: number,
    isFromBar: boolean,
    isHittingBlot: boolean,
    hitPlayer: number
  ) => {
    moveCountRef.current += 1;
    if (isFromBar) {
      const newPoints = boardPoints.map(p => {
        if (p.id === toPointId) {
          if (isHittingBlot) {
            return { ...p, checkers: currentPlayer > 0 ? 1 : -1 };
          } else {
            const newCheckers = p.checkers + (currentPlayer > 0 ? 1 : -1);
            return { ...p, checkers: newCheckers };
          }
        }
        return p;
      });

      if (isHittingBlot) {
        if (hitPlayer > 0) {
          setWhiteBar(prev => prev + 1);
        } else {
          setBlackBar(prev => prev + 1);
        }
      }

      setBoardPoints(newPoints);
      
      if (currentPlayer > 0) {
        setWhiteBar(prev => Math.max(0, prev - 1));
      } else {
        setBlackBar(prev => Math.max(0, prev - 1));
      }
    } else if (fromPointId !== null) {
      const newPoints = boardPoints.map(p => {
        if (p.id === fromPointId) {
          return { ...p, checkers: p.checkers - (p.checkers > 0 ? 1 : -1) };
        }
        if (p.id === toPointId) {
          if (isHittingBlot) {
            return { ...p, checkers: currentPlayer > 0 ? 1 : -1 };
          } else {
            const newCheckers = p.checkers + (currentPlayer > 0 ? 1 : -1);
            return { ...p, checkers: newCheckers };
          }
        }
        return p;
      });

      if (isHittingBlot) {
        const destinationPoint = boardPoints.find(p => p.id === toPointId);
        if (destinationPoint) {
          if (destinationPoint.checkers > 0) {
            setWhiteBar(prev => prev + 1);
          } else {
            setBlackBar(prev => prev + 1);
          }
        }
      }

      setBoardPoints(newPoints);
    }
  };

  const bearOffChecker = (fromPointId: number) => {
    const newPoints = boardPoints.map(p => {
      if (p.id === fromPointId) {
        return { ...p, checkers: p.checkers - (p.checkers > 0 ? 1 : -1) };
      }
      return p;
    });

    setBoardPoints(newPoints);
    moveCountRef.current += 1;
    
    if (currentPlayer > 0) {
      setWhiteBorneOff(prev => prev + 1);
    } else {
      setBlackBorneOff(prev => prev + 1);
    }
  };

  const setGameState = (
    newBoardPoints: Point[],
    newWhiteBar: number = 0,
    newBlackBar: number = 0,
    newWhiteBorneOff: number = 0,
    newBlackBorneOff: number = 0,
    newCurrentPlayer: number = 1
  ) => {
    setBoardPoints([...newBoardPoints]);
    setWhiteBar(newWhiteBar);
    setBlackBar(newBlackBar);
    setWhiteBorneOff(newWhiteBorneOff);
    setBlackBorneOff(newBlackBorneOff);
    setCurrentPlayer(newCurrentPlayer);
    setSelectedPointId(null);
    setSelectedFromBar(false);
  };

  const getGameStatistics = () => {
    const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
    return {
      moves: moveCountRef.current,
      duration: gameDuration,
      winner: winner,
      whiteBorneOff,
      blackBorneOff,
    };
  };

  const getGameScore = (): GameScore => {
    const baseScore = 1;
    const multiplier = gameResultType === 'backgammon' ? 3 : gameResultType === 'gammon' ? 2 : 1;
    const finalScore = baseScore * cubeValue * multiplier;
    
    return {
      resultType: gameResultType,
      baseScore,
      cubeValue,
      finalScore,
    };
  };

  return {
    boardPoints,
    setBoardPoints,
    currentPlayer,
    whiteBar,
    blackBar,
    whiteBorneOff,
    blackBorneOff,
    selectedPointId,
    setSelectedPointId,
    selectedFromBar,
    setSelectedFromBar,
    resetGame,
    hasCrashedPieces,
    switchPlayer,
    moveChecker,
    bearOffChecker,
    setGameState,
    gameEnded,
    setGameEnded,
    winner,
    setWinner,
    getGameStatistics,
    gameResultType,
    cubeValue,
    setCubeValue,
    getGameScore,
  };
};
