import { useEffect } from 'react';
import { useSettings } from './useSettings';
import * as soundManager from '../utils/soundManager';

export const useSound = () => {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings) {
      soundManager.setSoundEnabled(settings.soundEnabled);
    }
  }, [settings]);

  return {
    playDiceRoll: soundManager.playDiceRollSound,
    playMove: soundManager.playMoveSound,
    playHit: soundManager.playHitSound,
    playWin: soundManager.playWinSound,
    playError: soundManager.playErrorSound,
  };
};
