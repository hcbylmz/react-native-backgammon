import React from 'react';
import Animated from 'react-native-reanimated';
import WhiteChecker from './WhiteChecker';
import BlackChecker from './BlackChecker';

interface AnimatedCheckerProps {
  isWhite: boolean;
  width: number;
  height: number;
  animatedStyle?: any;
}

const AnimatedChecker: React.FC<AnimatedCheckerProps> = ({
  isWhite,
  width,
  height,
  animatedStyle,
}) => {
  return (
    <Animated.View style={animatedStyle}>
      {isWhite ? (
        <WhiteChecker width={width} height={height} />
      ) : (
        <BlackChecker width={width} height={height} />
      )}
    </Animated.View>
  );
};

export default AnimatedChecker;
