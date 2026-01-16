import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface AnimationConfig {
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
  duration?: number;
}

export const useCheckerAnimation = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animateMove = (config: AnimationConfig) => {
    if (config.fromX !== undefined) translateX.value = config.fromX;
    if (config.fromY !== undefined) translateY.value = config.fromY;
    
    opacity.value = withTiming(1, { duration: 100 });
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    
    if (config.toX !== undefined || config.toY !== undefined) {
      translateX.value = withSpring(
        config.toX ?? translateX.value,
        {
          damping: 15,
          stiffness: 150,
        }
      );
      
      translateY.value = withSpring(
        config.toY ?? translateY.value,
        {
          damping: 15,
          stiffness: 150,
        }
      );
    }
  };

  const animateRemove = () => {
    scale.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
  };

  const animateHit = () => {
    scale.value = withSpring(1.2, { damping: 10, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    });
  };

  const reset = () => {
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
    opacity.value = 1;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return {
    animateMove,
    animateRemove,
    animateHit,
    reset,
    animatedStyle,
  };
};
