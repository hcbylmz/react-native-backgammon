import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PlayerTurnIndicator from './PlayerTurnIndicator';

interface GameInfoPanelProps {
  currentPlayer: number;
  cubeValue: number;
  cubeOwner: number | null;
  player1Name?: string;
  player2Name?: string;
  moveCount?: number;
  turnNumber?: number;
  elapsedTime?: number;
  moveTime?: number;
  formatTime?: (seconds: number) => string;
}

const GameInfoPanel: React.FC<GameInfoPanelProps> = memo(({
  currentPlayer,
  cubeValue,
  cubeOwner,
  player1Name = 'White',
  player2Name = 'Black',
  moveCount = 0,
  turnNumber = 1,
  elapsedTime,
  moveTime,
  formatTime,
}) => {
  const ownerName = cubeOwner && cubeOwner > 0 ? player1Name : cubeOwner && cubeOwner < 0 ? player2Name : null;

  return (
    <View style={styles.container}>
      <PlayerTurnIndicator
        currentPlayer={currentPlayer}
        player1Name={player1Name}
        player2Name={player2Name}
      />
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Cube:</Text>
        <Text style={styles.value}>{cubeValue}</Text>
        {ownerName && (
          <Text style={styles.ownerText}>({ownerName})</Text>
        )}
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Moves:</Text>
        <Text style={styles.value}>{moveCount}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Turn:</Text>
        <Text style={styles.value}>{turnNumber}</Text>
      </View>

      {elapsedTime !== undefined && formatTime && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Game Time:</Text>
          <Text style={styles.value}>{formatTime(elapsedTime)}</Text>
        </View>
      )}

      {moveTime !== undefined && formatTime && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Move Time:</Text>
          <Text style={[styles.value, moveTime > 50 && styles.warningText]}>
            {formatTime(moveTime)}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#D2B48C',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B4513',
    gap: 8,
    minWidth: 150,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: '#654321',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  ownerText: {
    fontSize: 10,
    color: '#654321',
    fontStyle: 'italic',
  },
  warningText: {
    color: '#F44336',
  },
});

GameInfoPanel.displayName = 'GameInfoPanel';

export default GameInfoPanel;
