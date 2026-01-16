import { useState, useEffect, useCallback } from 'react';
import { saveGame, loadGame, deleteGame, listSavedGames, SavedGameState } from '../utils/gameStorage';

export const useGameSave = () => {
  const [savedGames, setSavedGames] = useState<Array<{ slot: number; timestamp: number }>>([]);
  const [loading, setLoading] = useState(false);

  const refreshSavedGames = useCallback(async () => {
    setLoading(true);
    try {
      const games = await listSavedGames();
      setSavedGames(games);
    } catch (error) {
      console.error('Error refreshing saved games:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSavedGames();
  }, [refreshSavedGames]);

  const save = useCallback(async (slot: number, gameState: SavedGameState): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await saveGame(slot, {
        ...gameState,
        timestamp: Date.now(),
      });
      if (success) {
        await refreshSavedGames();
      }
      return success;
    } catch (error) {
      console.error('Error saving game:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshSavedGames]);

  const load = useCallback(async (slot: number): Promise<SavedGameState | null> => {
    setLoading(true);
    try {
      return await loadGame(slot);
    } catch (error) {
      console.error('Error loading game:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (slot: number): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await deleteGame(slot);
      if (success) {
        await refreshSavedGames();
      }
      return success;
    } catch (error) {
      console.error('Error deleting game:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshSavedGames]);

  return {
    save,
    load,
    remove,
    savedGames,
    loading,
    refreshSavedGames,
  };
};
