import { useState, useEffect, useRef } from 'react';

interface UseGameTimerOptions {
  enabled?: boolean;
  perMoveLimit?: number;
  onTimeWarning?: () => void;
  onTimeUp?: () => void;
}

export const useGameTimer = (options: UseGameTimerOptions = {}) => {
  const { enabled = false, perMoveLimit, onTimeWarning, onTimeUp } = options;
  const [elapsedTime, setElapsedTime] = useState(0);
  const [moveTime, setMoveTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  useEffect(() => {
    if (enabled) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      if (perMoveLimit) {
        moveIntervalRef.current = setInterval(() => {
          setMoveTime(prev => {
            const newTime = prev + 1;
            if (newTime >= perMoveLimit - 10 && !warningShownRef.current && onTimeWarning) {
              warningShownRef.current = true;
              onTimeWarning();
            }
            if (newTime >= perMoveLimit && onTimeUp) {
              onTimeUp();
            }
            return newTime;
          });
        }, 1000);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [enabled, perMoveLimit, onTimeWarning, onTimeUp]);

  const resetMoveTimer = () => {
    setMoveTime(0);
    warningShownRef.current = false;
  };

  const reset = () => {
    setElapsedTime(0);
    setMoveTime(0);
    warningShownRef.current = false;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    elapsedTime,
    moveTime,
    formatTime,
    resetMoveTimer,
    reset,
  };
};
