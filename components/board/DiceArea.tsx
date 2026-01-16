import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Dice from '../dice/Dice';
import DiceDebug from '../dice/DiceDebug';

interface DiceAreaProps {
  dice1: number;
  dice2: number;
  isRolling: boolean;
  usedDice: number[];
  currentPlayer: number;
  hasCrashed: boolean;
  gameEnded: boolean;
  onRollDice: () => void;
  onSetDice: (dice1: number, dice2: number) => void;
  onResetGame: () => void;
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
  onSetDice,
  onResetGame,
}) => {
  const allDiceUsed = usedDice.length >= (dice1 === dice2 ? 4 : 2);

  return (
    <View style={styles.diceArea}>
      <View style={styles.diceContainer}>
        <Dice value={dice1} size={40} isRolling={isRolling} />
        <Dice value={dice2} size={40} isRolling={isRolling} />
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
      <DiceDebug dice1={dice1} dice2={dice2} onSetDice={onSetDice} />
      <Text style={styles.playerText}>
        {gameEnded ? 'Game Over' : `${currentPlayer > 0 ? 'White' : 'Black'} to move${hasCrashed ? ' (Enter from bar)' : ''}`}
      </Text>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={onResetGame}
      >
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  diceArea: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  diceContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
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
  resetButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default DiceArea;
