import AsyncStorage from '@react-native-async-storage/async-storage';
import { Point } from '../types/game';

export interface SavedGameState {
  boardPoints: Point[];
  whiteBar: number;
  blackBar: number;
  whiteBorneOff: number;
  blackBorneOff: number;
  currentPlayer: number;
  dice1: number;
  dice2: number;
  usedDice: number[];
  cubeValue: number;
  cubeOwner: number | null;
  timestamp: number;
}

const SAVE_SLOTS = 5;
const STORAGE_KEY_PREFIX = 'backgammon_save_';

export const saveGame = async (slot: number, gameState: SavedGameState): Promise<boolean> => {
  try {
    if (slot < 1 || slot > SAVE_SLOTS) {
      return false;
    }
    const key = `${STORAGE_KEY_PREFIX}${slot}`;
    await AsyncStorage.setItem(key, JSON.stringify(gameState));
    return true;
  } catch (error) {
    console.error('Error saving game:', error);
    return false;
  }
};

export const loadGame = async (slot: number): Promise<SavedGameState | null> => {
  try {
    if (slot < 1 || slot > SAVE_SLOTS) {
      return null;
    }
    const key = `${STORAGE_KEY_PREFIX}${slot}`;
    const data = await AsyncStorage.getItem(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as SavedGameState;
  } catch (error) {
    console.error('Error loading game:', error);
    return null;
  }
};

export const deleteGame = async (slot: number): Promise<boolean> => {
  try {
    if (slot < 1 || slot > SAVE_SLOTS) {
      return false;
    }
    const key = `${STORAGE_KEY_PREFIX}${slot}`;
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error deleting game:', error);
    return false;
  }
};

export const listSavedGames = async (): Promise<Array<{ slot: number; timestamp: number }>> => {
  try {
    const savedGames: Array<{ slot: number; timestamp: number }> = [];
    
    for (let i = 1; i <= SAVE_SLOTS; i++) {
      const game = await loadGame(i);
      if (game) {
        savedGames.push({ slot: i, timestamp: game.timestamp });
      }
    }
    
    return savedGames.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error listing saved games:', error);
    return [];
  }
};
