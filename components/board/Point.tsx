import React, { useEffect, memo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import Animated, { useAnimatedStyle, withSpring, withRepeat, withTiming, useSharedValue } from 'react-native-reanimated';
import { Point as PointType } from '../../types/game';
import WhiteChecker from '../checkers/WhiteChecker';
import BlackChecker from '../checkers/BlackChecker';
import { useCheckerPosition } from '../../contexts/CheckerPositionContext';

interface PointProps {
  point: PointType;
  isTop: boolean;
  index: number;
  isSelected: boolean;
  isAvailable: boolean;
  isForced?: boolean;
  isHint?: boolean;
  onPress: (pointId: number) => void;
}

const Point: React.FC<PointProps> = ({
  point,
  isTop,
  index,
  isSelected,
  isAvailable,
  isForced,
  isHint,
  onPress,
}) => {
  const checkerCount = Math.abs(point.checkers);
  const isPlayer1 = point.checkers > 0;
  const pulseAnim = useSharedValue(1);
  const borderWidth = useSharedValue(0);
  const { setPosition } = useCheckerPosition();

  useEffect(() => {
    if (isSelected) {
      pulseAnim.value = withRepeat(
        withTiming(1.05, { duration: 800 }),
        -1,
        true
      );
      borderWidth.value = withSpring(3);
    } else {
      pulseAnim.value = withSpring(1);
      borderWidth.value = withSpring(0);
    }
  }, [isSelected]);

  const isDarkPoint = index % 2 === 0;
  let pointColor = isDarkPoint ? '#5D4037' : '#CD853F';

  if (isForced) {
    pointColor = '#FF6B6B';
  } else if (isSelected) {
    pointColor = '#FFD700';
  } else if (isHint) {
    pointColor = '#87CEEB';
  } else if (isAvailable) {
    pointColor = '#90EE90';
  }

  const animatedTriangleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderWidth: borderWidth.value,
      borderColor: isSelected ? '#FFA500' : 'transparent',
    };
  });

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
  const AnimatedCheckerWrapper = Animated.createAnimatedComponent(View);

  const handleLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/e69eed9a-26a8-4b0c-af5e-6b7b0a93fd43',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Point.tsx:handleLayout',message:'Point layout measured (raw)',data:{pointId:point.id,x,y,width,height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    setPosition(`point-${point.id}`, { x, y, width, height });
  };

  return (
    <Pressable
      style={styles.pointWrapper}
      onPress={() => onPress(point.id)}
      onLayout={handleLayout}
      accessibilityLabel={`Point ${point.id}, ${checkerCount} ${isPlayer1 ? 'white' : 'black'} checker${checkerCount !== 1 ? 's' : ''}`}
      accessibilityRole="button"
      accessibilityHint={isSelected ? 'Selected point' : isAvailable ? 'Available destination' : ''}
    >
      <Animated.View style={[styles.triangleContainer, animatedBorderStyle, animatedTriangleStyle]}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Polygon
            points={isTop ? '0,0 50,100 100,0' : '0,100 50,0 100,100'}
            fill={pointColor}
          />
        </Svg>
      </Animated.View>
      <View style={[
        styles.checkersContainer,
        isTop ? styles.checkersTop : styles.checkersBottom,
      ]}>
        {Array.from({ length: checkerCount }).map((_, idx) => {
          const shouldStack = checkerCount >= 5;
          const stackSpacing = 22;
          let stackOffset = 0;
          
          if (shouldStack) {
            stackOffset = idx * stackSpacing;
          }
          
          const stackStyle = stackOffset > 0 ? {
            position: 'absolute' as const,
            ...(isTop 
              ? { top: stackOffset } 
              : { bottom: stackOffset }
            ),
          } : {};

          return (
            <AnimatedCheckerWrapper
              key={`${point.id}-${idx}`}
              style={[styles.checkerWrapper, stackStyle]}
            >
              {isPlayer1 ? (
                <WhiteChecker width={28} height={28} />
              ) : (
                <BlackChecker width={28} height={28} />
              )}
            </AnimatedCheckerWrapper>
          );
        })}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pointWrapper: {
    flex: 1,
    minWidth: 44,
    minHeight: 44,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkerWrapper: {
    marginVertical: 0.5,
  },
  triangleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    borderRadius: 2,
  },
  checkersContainer: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 2,
    alignItems: 'center',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  checkersTop: {
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  checkersBottom: {
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
});

export default memo(Point);
