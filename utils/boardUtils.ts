import { Point } from '../types/game';

export const getLeftTopPoints = (points: Point[]): Point[] => {
  return points.slice(18).reverse();
};

export const getLeftBottomPoints = (points: Point[]): Point[] => {
  return points.slice(0, 6);
};

export const getRightTopPoints = (points: Point[]): Point[] => {
  return points.slice(12, 18).reverse();
};

export const getRightBottomPoints = (points: Point[]): Point[] => {
  return points.slice(6, 12);
};

export const calculateTargetPoint = (fromPointId: number, diceValue: number, player: number): number => {
  if (player > 0) {
    return fromPointId - diceValue;
  } else {
    return fromPointId + diceValue;
  }
};

export const calculateEntryPoint = (diceValue: number, player: number): number => {
  if (player > 0) {
    return 25 - diceValue;
  } else {
    return diceValue;
  }
};
