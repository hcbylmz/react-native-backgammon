export interface Point {
  id: number;
  checkers: number;
}

export interface BackgammonBoardProps {
  points?: Point[];
}

export interface Move {
  from: number;
  to: number;
}

export interface BearingOffAreaProps {
  whiteBorneOff: number;
  blackBorneOff: number;
  currentPlayer: number;
  isBearingOff: boolean;
  onPress: () => void;
}

export type GameResultType = 'normal' | 'gammon' | 'backgammon';

export interface GameScore {
  resultType: GameResultType;
  baseScore: number;
  cubeValue: number;
  finalScore: number;
}
