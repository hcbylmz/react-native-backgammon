import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import WhiteChecker from '../checkers/WhiteChecker';
import BlackChecker from '../checkers/BlackChecker';
import { BearingOffAreaProps } from '../../types/game';

const BearingOffArea: React.FC<BearingOffAreaProps> = ({
  whiteBorneOff,
  blackBorneOff,
  currentPlayer,
  isBearingOff,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        {whiteBorneOff > 0 && (
          <View style={styles.borneOffContainer}>
            <Text style={styles.countText}>{whiteBorneOff}</Text>
            <View style={styles.checkerStack}>
              {Array.from({ length: Math.min(whiteBorneOff, 5) }).map((_, idx) => (
                <View key={`white-borne-${idx}`} style={styles.checker}>
                  <WhiteChecker width={20} height={20} />
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
                  <BlackChecker width={20} height={20} />
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
    width: 60,
    backgroundColor: '#654321',
    flexShrink: 0,
    marginLeft: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    borderWidth: 2,
    borderColor: '#8B4513',
    alignSelf: 'stretch',
    maxHeight: '100%',
  },
  topArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  bottomArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  borneOffContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  checkerStack: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  checker: {
    marginVertical: 1,
  },
  countText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bearingOffZone: {
    width: '90%',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#90EE90',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#32CD32',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
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
