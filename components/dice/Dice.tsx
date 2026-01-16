import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

interface DiceProps {
  value: number;
  size?: number;
  isRolling?: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, size = 50, isRolling = false }) => {
  // Dot positions for each dice face (1-6)
  const dotPositions: { [key: number]: Array<{ x: number; y: number }> } = {
    1: [{ x: 50, y: 50 }],
    2: [{ x: 30, y: 30 }, { x: 70, y: 70 }],
    3: [{ x: 30, y: 30 }, { x: 50, y: 50 }, { x: 70, y: 70 }],
    4: [{ x: 30, y: 30 }, { x: 70, y: 30 }, { x: 30, y: 70 }, { x: 70, y: 70 }],
    5: [
      { x: 30, y: 30 },
      { x: 70, y: 30 },
      { x: 50, y: 50 },
      { x: 30, y: 70 },
      { x: 70, y: 70 },
    ],
    6: [
      { x: 30, y: 25 },
      { x: 30, y: 50 },
      { x: 30, y: 75 },
      { x: 70, y: 25 },
      { x: 70, y: 50 },
      { x: 70, y: 75 },
    ],
  };

  const dots = dotPositions[value] || [];

  return (
    <View
      style={[
        styles.diceContainer,
        {
          width: size,
          height: size,
          opacity: isRolling ? 0.6 : 1,
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Rect
          x="5"
          y="5"
          width="90"
          height="90"
          rx="15"
          ry="15"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="2"
        />
        {dots.map((dot, index) => (
          <Circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={8}
            fill="#000000"
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  diceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dice;
