import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import WhiteChecker from '../checkers/WhiteChecker';
import BlackChecker from '../checkers/BlackChecker';
import { useCheckerAnimation } from '../../contexts/CheckerAnimationContext';

const AnimatedCheckerOverlay: React.FC = () => {
  const { activeAnimation, translateX, translateY, scale, opacity } = useCheckerAnimation();
  const lastLoggedRef = useRef<string>('');

  useEffect(() => {
    if (activeAnimation) {
      const logId = `${activeAnimation.id}-${translateX.value}-${translateY.value}`;
      if (logId !== lastLoggedRef.current) {
        lastLoggedRef.current = logId;
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/e69eed9a-26a8-4b0c-af5e-6b7b0a93fd43',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnimatedCheckerOverlay.tsx:useEffect',message:'Overlay animation values',data:{animationId:activeAnimation.id,translateX:translateX.value,translateY:translateY.value,scale:scale.value,opacity:opacity.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
      }
    }
  }, [activeAnimation, translateX.value, translateY.value, scale.value, opacity.value]);

  const animatedViewStyle = useAnimatedStyle(() => {
    const x = translateX.value || 0;
    const y = translateY.value || 0;
    const left = x - 14;
    const top = y - 14;
    return {
      position: 'absolute',
      left,
      top,
      width: 28,
      height: 28,
      zIndex: 1000,
      transform: [
        { scale: scale.value || 1 },
      ],
      opacity: opacity.value || 0,
    };
  });

  if (!activeAnimation) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={animatedViewStyle}>
        {activeAnimation.isWhite ? (
          <WhiteChecker width={28} height={28} />
        ) : (
          <BlackChecker width={28} height={28} />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
});

export default AnimatedCheckerOverlay;
