import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import WhiteChecker from '../checkers/WhiteChecker';
import BlackChecker from '../checkers/BlackChecker';
import DiceArea from './DiceArea';

interface BarProps {
  whiteBar: number;
  blackBar: number;
  currentPlayer: number;
  selectedFromBar: boolean;
  dice1: number;
  dice2: number;
  isRolling: boolean;
  usedDice: number[];
  hasCrashed: boolean;
  gameEnded: boolean;
  onBarPress: () => void;
  onRollDice: () => void;
  onSetDice: (dice1: number, dice2: number) => void;
  onResetGame: () => void;
}

const Bar: React.FC<BarProps> = ({
  whiteBar,
  blackBar,
  currentPlayer,
  selectedFromBar,
  dice1,
  dice2,
  isRolling,
  usedDice,
  hasCrashed,
  gameEnded,
  onBarPress,
  onRollDice,
  onSetDice,
  onResetGame,
}) => {
  return (
    <View style={styles.bar}>
      <Pressable
        style={[
          styles.barPiecesTop,
          selectedFromBar && currentPlayer > 0 && whiteBar > 0 && styles.barSelected
        ]}
        onPress={currentPlayer > 0 && whiteBar > 0 ? onBarPress : undefined}
        disabled={currentPlayer !== 1 || whiteBar === 0}
        accessibilityLabel={`White bar, ${whiteBar} checker${whiteBar !== 1 ? 's' : ''}`}
        accessibilityRole="button"
        accessibilityHint={selectedFromBar ? 'Selected' : whiteBar > 0 ? 'Tap to select checker from bar' : ''}
      >
        {Array.from({ length: whiteBar }).map((_, idx) => (
          <View key={`white-bar-${idx}`} style={styles.barPiece}>
            <WhiteChecker width={24} height={24} />
          </View>
        ))}
      </Pressable>
      
      <DiceArea
        dice1={dice1}
        dice2={dice2}
        isRolling={isRolling}
        usedDice={usedDice}
        currentPlayer={currentPlayer}
        hasCrashed={hasCrashed}
        gameEnded={gameEnded}
        onRollDice={onRollDice}
        onSetDice={onSetDice}
        onResetGame={onResetGame}
      />
      
      <Pressable
        style={[
          styles.barPiecesBottom,
          selectedFromBar && currentPlayer < 0 && blackBar > 0 && styles.barSelected
        ]}
        onPress={currentPlayer < 0 && blackBar > 0 ? onBarPress : undefined}
        disabled={currentPlayer !== -1 || blackBar === 0}
        accessibilityLabel={`Black bar, ${blackBar} checker${blackBar !== 1 ? 's' : ''}`}
        accessibilityRole="button"
        accessibilityHint={selectedFromBar ? 'Selected' : blackBar > 0 ? 'Tap to select checker from bar' : ''}
      >
        {Array.from({ length: blackBar }).map((_, idx) => (
          <View key={`black-bar-${idx}`} style={styles.barPiece}>
            <BlackChecker width={24} height={24} />
          </View>
        ))}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: 60,
    backgroundColor: '#8B4513',
    flexShrink: 0,
    marginHorizontal: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  barPiecesTop: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    paddingHorizontal: 4,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 4,
    maxHeight: '30%',
  },
  barPiecesBottom: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 4,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 4,
    maxHeight: '30%',
  },
  barPiece: {
    marginVertical: 2,
  },
  barSelected: {
    backgroundColor: '#FFD700',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
});

export default Bar;
