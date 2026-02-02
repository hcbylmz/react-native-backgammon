import { useState, useCallback, useRef, useEffect } from 'react';
import { useSharedValue, withSpring, withTiming, cancelAnimation } from 'react-native-reanimated';
import { useSettings } from './useSettings';

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnimationMove {
  id: string;
  from: Position | null; // null means from bar
  to: Position | null; // null means bearing off
  isWhite: boolean;
  isHit?: boolean;
  onComplete?: () => void;
}

const ANIMATION_SPEED_MULTIPLIERS = {
  slow: 1.5,
  normal: 1.0,
  fast: 0.6,
};

export const useCheckerMoveAnimation = () => {
  const settings = useSettings();
  const [activeAnimation, setActiveAnimation] = useState<AnimationMove | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const pendingCallback = useRef<(() => void) | null>(null);
  const animationStartTime = useRef<number | null>(null);

  const getSpeedMultiplier = useCallback(() => {
    const speed = settings.settings?.animationSpeed || 'normal';
    return ANIMATION_SPEED_MULTIPLIERS[speed];
  }, [settings.settings?.animationSpeed]);

  useEffect(() => {
    if (!activeAnimation) {
      if (pendingCallback.current) {
        const callback = pendingCallback.current;
        pendingCallback.current = null;
        callback();
      }
      translateX.value = 0;
      translateY.value = 0;
      opacity.value = 0;
      scale.value = 1;
    }
  }, [activeAnimation, translateX, translateY, opacity, scale]);

  const animateMove = useCallback((move: AnimationMove) => {
    try {
      if (!move.from && !move.to) {
        if (move.onComplete) {
          pendingCallback.current = move.onComplete;
        }
        
        cancelAnimation(scale);
        cancelAnimation(opacity);
        
        setActiveAnimation(move);
        opacity.value = 1;
        scale.value = 1;
        
        const speed = getSpeedMultiplier();
        const totalDuration = 300 * speed;
        animationStartTime.current = Date.now();
        
        scale.value = withTiming(0, { duration: 200 * speed });
        opacity.value = withTiming(0, { duration: totalDuration });
        
        setTimeout(() => {
          setActiveAnimation(null);
        }, totalDuration);
        return;
      }

      if (!move.from) {
        if (!move.to || !move.to.width || !move.to.height) {
          if (move.onComplete) {
            move.onComplete();
          }
          return;
        }
        
        if (move.onComplete) {
          pendingCallback.current = move.onComplete;
        }
        
        cancelAnimation(translateX);
        cancelAnimation(translateY);
        cancelAnimation(scale);
        cancelAnimation(opacity);
        
        setActiveAnimation(move);
        const targetX = move.to.x + move.to.width / 2;
        const targetY = move.to.y + move.to.height / 2;
        translateX.value = targetX;
        translateY.value = targetY;
        opacity.value = 0;
        scale.value = 0.5;
        
        const speed = getSpeedMultiplier();
        const springDuration = 500 * speed;
        animationStartTime.current = Date.now();
        
        opacity.value = withTiming(1, { duration: 100 * speed });
        scale.value = withSpring(1, { damping: 20, stiffness: 200 });
        
        setTimeout(() => {
          setActiveAnimation(null);
        }, springDuration);
        return;
      }

      if (!move.to) {
        if (!move.from || !move.from.width || !move.from.height) {
          if (move.onComplete) {
            move.onComplete();
          }
          return;
        }
        
        if (move.onComplete) {
          pendingCallback.current = move.onComplete;
        }
        
        cancelAnimation(translateX);
        cancelAnimation(translateY);
        cancelAnimation(scale);
        cancelAnimation(opacity);
        
        setActiveAnimation(move);
        const startX = move.from.x + move.from.width / 2;
        const startY = move.from.y + move.from.height / 2;
        translateX.value = startX;
        translateY.value = startY;
        opacity.value = 1;
        scale.value = 1;
        
        const speed = getSpeedMultiplier();
        const totalDuration = 300 * speed;
        animationStartTime.current = Date.now();
        
        scale.value = withTiming(0, { duration: 200 * speed });
        opacity.value = withTiming(0, { duration: totalDuration });
        
        setTimeout(() => {
          setActiveAnimation(null);
        }, totalDuration);
        return;
      }

      if (!move.from.width || !move.from.height || !move.to.width || !move.to.height) {
        if (move.onComplete) {
          move.onComplete();
        }
        return;
      }

      if (move.onComplete) {
        pendingCallback.current = move.onComplete;
      }
      
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(scale);
      cancelAnimation(opacity);
      
      setActiveAnimation(move);
      
      const startX = move.from.x + move.from.width / 2;
      const startY = move.from.y + move.from.height / 2;
      const targetX = move.to.x + move.to.width / 2;
      const targetY = move.to.y + move.to.height / 2;
      
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/e69eed9a-26a8-4b0c-af5e-6b7b0a93fd43',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCheckerMoveAnimation.ts:animateMove',message:'Animation coordinates calculated',data:{fromX:move.from.x,fromY:move.from.y,fromWidth:move.from.width,fromHeight:move.from.height,toX:move.to.x,toY:move.to.y,toWidth:move.to.width,toHeight:move.to.height,startX,startY,targetX,targetY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      opacity.value = 1;
      scale.value = 1;
      
      translateX.value = startX;
      translateY.value = startY;

      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/e69eed9a-26a8-4b0c-af5e-6b7b0a93fd43',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCheckerMoveAnimation.ts:animateMove',message:'Initial position set',data:{startX,startY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion

      const speed = getSpeedMultiplier();
      const springDuration = 600 * speed;
      animationStartTime.current = Date.now();
      
      if (move.isHit) {
        scale.value = withSpring(1.2, { damping: 15, stiffness: 250 });
        setTimeout(() => {
          scale.value = withSpring(1, { damping: 20, stiffness: 200 });
        }, 100);
      }
      
      setTimeout(() => {
        translateX.value = withSpring(
          targetX,
          { damping: 20, stiffness: 200 }
        );
        translateY.value = withSpring(
          targetY,
          { damping: 20, stiffness: 200 }
        );
      }, 16);
      
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/e69eed9a-26a8-4b0c-af5e-6b7b0a93fd43',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCheckerMoveAnimation.ts:animateMove',message:'Animation started',data:{targetX,targetY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      setTimeout(() => {
        setActiveAnimation(null);
      }, springDuration);
    } catch (error) {
      console.error('Animation error:', error);
      if (move.onComplete) {
        move.onComplete();
      }
    }
  }, [getSpeedMultiplier, translateX, translateY, scale, opacity]);

  const animatedStyle = {
    transform: [
      { translateX },
      { translateY },
      { scale },
    ],
    opacity,
  };

  return {
    activeAnimation,
    animateMove,
    animatedStyle,
    translateX,
    translateY,
    scale,
    opacity,
  };
};
