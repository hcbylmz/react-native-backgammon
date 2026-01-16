import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface Move {
  from: number | null;
  to: number;
  player: number;
  moveNumber: number;
}

interface MoveHistoryProps {
  moves: Move[];
  maxDisplay?: number;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, maxDisplay = 10 }) => {
  const displayMoves = moves.slice(-maxDisplay).reverse();

  const formatMove = (move: Move): string => {
    if (move.from === null) {
      return `Bar → ${move.to}`;
    }
    if (move.to === -1) {
      return `${move.from} → Off`;
    }
    return `${move.from} → ${move.to}`;
  };

  const getPlayerName = (player: number): string => {
    return player > 0 ? 'White' : 'Black';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Move History</Text>
      <ScrollView style={styles.scrollView} nestedScrollEnabled>
        {displayMoves.length === 0 ? (
          <Text style={styles.emptyText}>No moves yet</Text>
        ) : (
          displayMoves.map((move, index) => (
            <View key={index} style={styles.moveRow}>
              <Text style={styles.moveNumber}>#{move.moveNumber}</Text>
              <Text style={styles.playerName}>{getPlayerName(move.player)}</Text>
              <Text style={styles.moveText}>{formatMove(move)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#D2B48C',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B4513',
    maxHeight: 200,
    minWidth: 150,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  scrollView: {
    maxHeight: 160,
  },
  moveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#8B4513',
  },
  moveNumber: {
    fontSize: 10,
    color: '#654321',
    fontWeight: '500',
    minWidth: 30,
  },
  playerName: {
    fontSize: 10,
    color: '#654321',
    fontWeight: 'bold',
    minWidth: 50,
  },
  moveText: {
    fontSize: 10,
    color: '#8B4513',
    flex: 1,
  },
  emptyText: {
    fontSize: 12,
    color: '#654321',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
});

export default MoveHistory;
