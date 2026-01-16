import { useEffect } from 'react';
import { useSettings } from './useSettings';
import * as hapticFeedback from '../utils/hapticFeedback';

export const useHaptic = () => {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings) {
      hapticFeedback.setHapticEnabled(settings.hapticEnabled);
    }
  }, [settings]);

  return {
    triggerMove: hapticFeedback.triggerMoveHaptic,
    triggerError: hapticFeedback.triggerErrorHaptic,
    triggerHit: hapticFeedback.triggerHitHaptic,
    triggerWin: hapticFeedback.triggerWinHaptic,
  };
};
