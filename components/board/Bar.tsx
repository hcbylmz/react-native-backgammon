import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import WhiteChecker from '../checkers/WhiteChecker';
import BlackChecker from '../checkers/BlackChecker';
import DiceArea from './DiceArea';
import { BOARD_LAYOUT } from '../../utils/boardLayout';
import { useCheckerPosition } from '../../contexts/CheckerPositionContext';

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
}) => {
  const { setPosition } = useCheckerPosition();

  const handleWhiteBarLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setPosition('bar-white', { x, y, width, height });
  };

  const handleBlackBarLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setPosition('bar-black', { x, y, width, height });
  };

  return (
    <View style={styles.bar}>
      <Pressable
        style={[
          styles.barPiecesTop,
          selectedFromBar && currentPlayer > 0 && whiteBar > 0 && styles.barSelected
        ]}
        onPress={currentPlayer > 0 && whiteBar > 0 ? onBarPress : undefined}
        onLayout={handleWhiteBarLayout}
        disabled={currentPlayer !== 1 || whiteBar === 0}
        accessibilityLabel={`White bar, ${whiteBar} checker${whiteBar !== 1 ? 's' : ''}`}
        accessibilityRole="button"
        accessibilityHint={selectedFromBar ? 'Selected' : whiteBar > 0 ? 'Tap to select checker from bar' : ''}
      >
        {Array.from({ length: whiteBar }).map((_, idx) => (
          <View key={`white-bar-${idx}`} style={styles.barPiece}>
            <WhiteChecker width={BOARD_LAYOUT.CHECKER_SIZE_BAR} height={BOARD_LAYOUT.CHECKER_SIZE_BAR} />
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
      />
      
      <Pressable
        style={[
          styles.barPiecesBottom,
          selectedFromBar && currentPlayer < 0 && blackBar > 0 && styles.barSelected
        ]}
        onPress={currentPlayer < 0 && blackBar > 0 ? onBarPress : undefined}
        onLayout={handleBlackBarLayout}
        disabled={currentPlayer !== -1 || blackBar === 0}
        accessibilityLabel={`Black bar, ${blackBar} checker${blackBar !== 1 ? 's' : ''}`}
        accessibilityRole="button"
        accessibilityHint={selectedFromBar ? 'Selected' : blackBar > 0 ? 'Tap to select checker from bar' : ''}
      >
        {Array.from({ length: blackBar }).map((_, idx) => (
          <View key={`black-bar-${idx}`} style={styles.barPiece}>
            <BlackChecker width={BOARD_LAYOUT.CHECKER_SIZE_BAR} height={BOARD_LAYOUT.CHECKER_SIZE_BAR} />
          </View>
        ))}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: BOARD_LAYOUT.CENTER_COLUMN_WIDTH,
    backgroundColor: '#8B4513',
    flexShrink: 0,
    marginHorizontal: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
  },
  barPiecesTop: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: BOARD_LAYOUT.BAR_PIECES_PADDING_TOP,
    paddingHorizontal: BOARD_LAYOUT.BAR_PIECES_PADDING_HORIZONTAL,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: BOARD_LAYOUT.BAR_PIECES_GAP,
    maxHeight: `${BOARD_LAYOUT.BAR_PIECES_MAX_HEIGHT_PERCENT}%`,
  },
  barPiecesBottom: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: BOARD_LAYOUT.BAR_PIECES_PADDING_BOTTOM,
    paddingHorizontal: BOARD_LAYOUT.BAR_PIECES_PADDING_HORIZONTAL,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: BOARD_LAYOUT.BAR_PIECES_GAP,
    maxHeight: `${BOARD_LAYOUT.BAR_PIECES_MAX_HEIGHT_PERCENT}%`,
  },
  barPiece: {
    marginVertical: BOARD_LAYOUT.BAR_PIECE_MARGIN_VERTICAL,
  },
  barSelected: {
    backgroundColor: '#FFD700',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
});

export default Bar;
