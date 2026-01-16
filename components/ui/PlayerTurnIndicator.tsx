import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PlayerTurnIndicatorProps {
  currentPlayer: number;
  player1Name?: string;
  player2Name?: string;
}

const PlayerTurnIndicator: React.FC<PlayerTurnIndicatorProps> = ({
  currentPlayer,
  player1Name = 'White',
  player2Name = 'Black',
}) => {
  const isPlayer1Turn = currentPlayer > 0;
  const currentPlayerName = isPlayer1Turn ? player1Name : player2Name;
  const playerColor = isPlayer1Turn ? '#FFFFFF' : '#000000';

  return (
    <View style={[styles.container, { backgroundColor: playerColor }]}>
      <Text style={[styles.text, { color: isPlayer1Turn ? '#000000' : '#FFFFFF' }]}>
        {currentPlayerName}'s Turn
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B4513',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PlayerTurnIndicator;
