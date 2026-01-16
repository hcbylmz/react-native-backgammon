import { Point } from '../types/game';

export const getInitialPoints = (points?: Point[]): Point[] => {
  if (points) return points;
  
  return Array.from({ length: 24 }, (_, i) => {
    const pointId = i + 1;
    let checkers = 0;
    
    if (pointId === 24) checkers = 2;
    else if (pointId === 13) checkers = 5;
    else if (pointId === 8) checkers = 3;
    else if (pointId === 6) checkers = 5;
    else if (pointId === 1) checkers = -2;
    else if (pointId === 12) checkers = -5;
    else if (pointId === 17) checkers = -3;
    else if (pointId === 19) checkers = -5;
    
    return {
      id: pointId,
      checkers,
    };
  });
};

export const canMove = (from: Point, to: Point, player: number): boolean => {
  if (from.checkers === 0) return false;
  if (Math.sign(from.checkers) !== player) return false;
  if (to.checkers !== 0 && Math.sign(to.checkers) !== player && Math.abs(to.checkers) >= 2) {
    return false;
  }
  return true;
};

export const isPointOpenForEntry = (pointId: number, player: number, points: Point[]): boolean => {
  const point = points.find(p => p.id === pointId);
  if (!point) return false;
  
  if (point.checkers === 0) return true;
  if (Math.sign(point.checkers) === player) return true;
  if (Math.abs(point.checkers) === 1) return true;
  
  return false;
};

export const isAllCheckersInHomeBoard = (player: number, points: Point[], whiteBar: number, blackBar: number): boolean => {
  const playerBar = player > 0 ? whiteBar : blackBar;
  if (playerBar > 0) {
    return false;
  }
  
  const homeBoardRange = player > 0 ? [1, 2, 3, 4, 5, 6] : [19, 20, 21, 22, 23, 24];
  
  for (const point of points) {
    if (Math.sign(point.checkers) === player && Math.abs(point.checkers) > 0) {
      if (!homeBoardRange.includes(point.id)) {
        return false;
      }
    }
  }
  
  return true;
};

export const canBearOff = (
  fromPointId: number, 
  diceValue: number, 
  player: number, 
  points: Point[],
  whiteBar: number = 0,
  blackBar: number = 0
): boolean => {
  const fromPoint = points.find(p => p.id === fromPointId);
  if (!fromPoint || fromPoint.checkers === 0 || Math.sign(fromPoint.checkers) !== player) {
    return false;
  }
  
  const playerBar = player > 0 ? whiteBar : blackBar;
  if (playerBar > 0) {
    return false;
  }
  
  const homeBoardRange = player > 0 ? [1, 2, 3, 4, 5, 6] : [19, 20, 21, 22, 23, 24];
  if (!homeBoardRange.includes(fromPointId)) {
    return false;
  }
  
  const hasCheckersBehind = points.some(p => {
    if (Math.sign(p.checkers) !== player || Math.abs(p.checkers) === 0) {
      return false;
    }
    
    if (!homeBoardRange.includes(p.id)) {
      return false;
    }
    
    if (player > 0) {
      return p.id > fromPointId;
    } else {
      return p.id < fromPointId;
    }
  });
  
  if (hasCheckersBehind) {
    return false;
  }
  
  if (player > 0) {
    if (fromPointId === diceValue) {
      return true;
    }
    if (fromPointId < diceValue) {
      const hasExactMatch = points.some(p => {
        if (Math.sign(p.checkers) !== player || Math.abs(p.checkers) === 0) {
          return false;
        }
        if (!homeBoardRange.includes(p.id)) {
          return false;
        }
        return p.id === diceValue;
      });
      return !hasExactMatch;
    }
    return false;
  } else {
    const blackPointValue = 25 - fromPointId;
    if (blackPointValue === diceValue) {
      return true;
    }
    if (blackPointValue < diceValue) {
      const hasExactMatch = points.some(p => {
        if (Math.sign(p.checkers) !== player || Math.abs(p.checkers) === 0) {
          return false;
        }
        if (!homeBoardRange.includes(p.id)) {
          return false;
        }
        const pValue = 25 - p.id;
        return pValue === diceValue;
      });
      return !hasExactMatch;
    }
    return false;
  }
};

export const detectGammon = (winner: number, whiteBorneOff: number, blackBorneOff: number): boolean => {
  if (winner > 0) {
    return blackBorneOff === 0;
  } else {
    return whiteBorneOff === 0;
  }
};

export const detectBackgammon = (
  winner: number,
  points: Point[],
  whiteBar: number,
  blackBar: number
): boolean => {
  const loser = winner > 0 ? -1 : 1;
  const loserBar = loser > 0 ? whiteBar : blackBar;
  
  if (loserBar > 0) {
    return true;
  }
  
  const winnerHomeBoardRange = winner > 0 ? [1, 2, 3, 4, 5, 6] : [19, 20, 21, 22, 23, 24];
  
  const hasCheckersInWinnerHome = points.some(p => {
    if (Math.sign(p.checkers) !== loser || Math.abs(p.checkers) === 0) {
      return false;
    }
    return winnerHomeBoardRange.includes(p.id);
  });
  
  return hasCheckersInWinnerHome;
};

export const getForcedMove = (
  dice1: number,
  dice2: number,
  player: number,
  points: Point[],
  whiteBar: number,
  blackBar: number,
  usedDice: number[]
): { from: number; to: number; diceValue: number } | null => {
  if (dice1 === 0 || dice2 === 0) return null;
  if (dice1 === dice2) return null;
  
  const largerDie = Math.max(dice1, dice2);
  const smallerDie = Math.min(dice1, dice2);
  
  const used1 = usedDice.filter(d => d === largerDie).length;
  const used2 = usedDice.filter(d => d === smallerDie).length;
  
  if (used1 > 0 || used2 > 0) return null;
  
  const playerBar = player > 0 ? whiteBar : blackBar;
  const hasCrashed = playerBar > 0;
  
  let canPlayLarger = false;
  let canPlaySmaller = false;
  
  if (hasCrashed) {
    const largerEntry = player > 0 ? 25 - largerDie : largerDie;
    const smallerEntry = player > 0 ? 25 - smallerDie : smallerDie;
    
    const largerPoint = points.find(p => p.id === largerEntry);
    const smallerPoint = points.find(p => p.id === smallerEntry);
    
    canPlayLarger = largerPoint ? isPointOpenForEntry(largerEntry, player, points) : false;
    canPlaySmaller = smallerPoint ? isPointOpenForEntry(smallerEntry, player, points) : false;
  } else {
    points.forEach(fromPoint => {
      if (fromPoint.checkers === 0 || Math.sign(fromPoint.checkers) !== player) return;
      
      const largerTarget = player > 0 ? fromPoint.id - largerDie : fromPoint.id + largerDie;
      const smallerTarget = player > 0 ? fromPoint.id - smallerDie : fromPoint.id + smallerDie;
      
      if (largerTarget >= 1 && largerTarget <= 24) {
        const targetPoint = points.find(p => p.id === largerTarget);
        if (targetPoint && canMove(fromPoint, targetPoint, player)) {
          canPlayLarger = true;
        }
      }
      
      if (smallerTarget >= 1 && smallerTarget <= 24) {
        const targetPoint = points.find(p => p.id === smallerTarget);
        if (targetPoint && canMove(fromPoint, targetPoint, player)) {
          canPlaySmaller = true;
        }
      }
    });
  }
  
  if (canPlayLarger && !canPlaySmaller) {
    if (hasCrashed) {
      const entryPoint = player > 0 ? 25 - largerDie : largerDie;
      if (entryPoint >= 1 && entryPoint <= 24) {
        return { from: -1, to: entryPoint, diceValue: largerDie };
      }
    } else {
      for (const fromPoint of points) {
        if (fromPoint.checkers === 0 || Math.sign(fromPoint.checkers) !== player) continue;
        
        const targetId = player > 0 ? fromPoint.id - largerDie : fromPoint.id + largerDie;
        if (targetId >= 1 && targetId <= 24) {
          const targetPoint = points.find(p => p.id === targetId);
          if (targetPoint && canMove(fromPoint, targetPoint, player)) {
            return { from: fromPoint.id, to: targetId, diceValue: largerDie };
          }
        }
      }
    }
  }
  
  return null;
};
