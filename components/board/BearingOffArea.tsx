import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import WhiteChecker from '../checkers/WhiteChecker';
import BlackChecker from '../checkers/BlackChecker';
import { BearingOffAreaProps } from '../../types/game';
import { BOARD_LAYOUT } from '../../utils/boardLayout';
import { useCheckerPosition } from '../../contexts/CheckerPositionContext';

const BearingOffArea: React.FC<BearingOffAreaProps> = ({
  whiteBorneOff,
  blackBorneOff,
  currentPlayer,
  isBearingOff,
  onPress,
}) => {
  const { setPosition } = useCheckerPosition();

  const handleBearingOffLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    if (currentPlayer > 0) {
      setPosition('bearing-off-white', { x, y, width, height });
    } else {
      setPosition('bearing-off-black', { x, y, width, height });
    }
  };

  return (
    <View style={styles.container} onLayout={handleBearingOffLayout}>
      <View style={styles.topArea}>
        {whiteBorneOff > 0 && (
          <View style={styles.borneOffContainer}>
            <Text style={styles.countText}>{whiteBorneOff}</Text>
            <View style={styles.checkerStack}>
              {Array.from({ length: Math.min(whiteBorneOff, 5) }).map((_, idx) => (
                <View key={`white-borne-${idx}`} style={styles.checker}>
                  <WhiteChecker width={BOARD_LAYOUT.CHECKER_SIZE_BEARING_OFF} height={BOARD_LAYOUT.CHECKER_SIZE_BEARING_OFF} />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
      
      {isBearingOff && (
        <Pressable
          style={[
            styles.bearingOffZone,
            currentPlayer > 0 ? styles.bearingOffZoneTop : styles.bearingOffZoneBottom,
          ]}
          onPress={onPress}
        >
          <Text style={styles.bearingOffText}>Bear Off</Text>
        </Pressable>
      )}
      
      <View style={styles.bottomArea}>
        {blackBorneOff > 0 && (
          <View style={styles.borneOffContainer}>
            <View style={styles.checkerStack}>
              {Array.from({ length: Math.min(blackBorneOff, 5) }).map((_, idx) => (
                <View key={`black-borne-${idx}`} style={styles.checker}>
                  <BlackChecker width={BOARD_LAYOUT.CHECKER_SIZE_BEARING_OFF} height={BOARD_LAYOUT.CHECKER_SIZE_BEARING_OFF} />
                </View>
              ))}
            </View>
            <Text style={styles.countText}>{blackBorneOff}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BOARD_LAYOUT.CENTER_COLUMN_WIDTH,
    backgroundColor: '#654321',
    flexShrink: 0,
    marginLeft: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    borderWidth: 2,
    borderColor: '#8B4513',
    alignSelf: 'stretch',
    height: '100%',
  },
  topArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: BOARD_LAYOUT.BEARING_OFF_PADDING_TOP,
    paddingHorizontal: BOARD_LAYOUT.BEARING_OFF_PADDING_HORIZONTAL,
  },
  bottomArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: BOARD_LAYOUT.BEARING_OFF_PADDING_BOTTOM,
    paddingHorizontal: BOARD_LAYOUT.BEARING_OFF_PADDING_HORIZONTAL,
  },
  borneOffContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: BOARD_LAYOUT.BEARING_OFF_CONTAINER_GAP,
  },
  checkerStack: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: BOARD_LAYOUT.BEARING_OFF_CHECKER_STACK_GAP,
  },
  checker: {
    marginVertical: BOARD_LAYOUT.BEARING_OFF_CHECKER_MARGIN_VERTICAL,
  },
  countText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bearingOffZone: {
    width: '90%',
    paddingVertical: BOARD_LAYOUT.BEARING_OFF_ZONE_PADDING_VERTICAL,
    paddingHorizontal: BOARD_LAYOUT.BEARING_OFF_ZONE_PADDING_HORIZONTAL,
    backgroundColor: '#90EE90',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#32CD32',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: BOARD_LAYOUT.BEARING_OFF_ZONE_MARGIN_VERTICAL,
  },
  bearingOffZoneTop: {
    alignSelf: 'flex-start',
  },
  bearingOffZoneBottom: {
    alignSelf: 'flex-end',
  },
  bearingOffText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default BearingOffArea;
