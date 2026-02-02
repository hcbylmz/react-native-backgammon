import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Dice from '../dice/Dice';
import { BOARD_LAYOUT } from '../../utils/boardLayout';

interface DiceAreaProps {
  dice1: number;
  dice2: number;
  isRolling: boolean;
  usedDice: number[];
  currentPlayer: number;
  hasCrashed: boolean;
  gameEnded: boolean;
  onRollDice: () => void;
}

const DiceArea: React.FC<DiceAreaProps> = ({
  dice1,
  dice2,
  isRolling,
  usedDice,
  currentPlayer,
  hasCrashed,
  gameEnded,
  onRollDice,
}) => {
  const allDiceUsed = usedDice.length >= (dice1 === dice2 ? 4 : 2);

  return (
    <View style={styles.diceArea}>
      <View style={styles.diceContainer}>
        <Dice value={dice1} size={BOARD_LAYOUT.DICE_SIZE} isRolling={isRolling} />
        <Dice value={dice2} size={BOARD_LAYOUT.DICE_SIZE} isRolling={isRolling} />
      </View>
      <TouchableOpacity
        style={styles.rollButton}
        onPress={onRollDice}
        disabled={gameEnded || isRolling || (dice1 > 0 && !allDiceUsed)}
      >
        <Text style={styles.rollButtonText}>
          {dice1 === 0 ? 'Roll Dice' : 'Re-roll'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.playerText}>
        {gameEnded ? 'Game Over' : `${currentPlayer > 0 ? 'White' : 'Black'} to move${hasCrashed ? ' (Enter from bar)' : ''}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  diceArea: {
    width: BOARD_LAYOUT.CENTER_COLUMN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BOARD_LAYOUT.DICE_AREA_PADDING_VERTICAL,
    flexShrink: 0,
  },
  diceContainer: {
    flexDirection: 'row',
    gap: BOARD_LAYOUT.DICE_CONTAINER_GAP,
    marginBottom: BOARD_LAYOUT.DICE_CONTAINER_MARGIN_BOTTOM,
  },
  rollButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  rollButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default DiceArea;
