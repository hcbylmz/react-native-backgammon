import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { GameScore } from '../types/game';

interface GameStatistics {
  moves: number;
  duration: number;
  winner: number | null;
  whiteBorneOff: number;
  blackBorneOff: number;
}

interface WinModalProps {
  visible: boolean;
  statistics: GameStatistics;
  score?: GameScore;
  onClose: () => void;
  onNewGame: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ visible, statistics, score, onClose, onNewGame }) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const winnerName = statistics.winner && statistics.winner > 0 ? 'White' : 'Black';
  const winnerColor = statistics.winner && statistics.winner > 0 ? '#FFFFFF' : '#000000';
  
  const getResultTypeLabel = (resultType: string): string => {
    switch (resultType) {
      case 'gammon':
        return 'Gammon';
      case 'backgammon':
        return 'Backgammon';
      default:
        return 'Normal Win';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      supportedOrientations={['landscape-left', 'landscape-right']}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={[styles.header, { backgroundColor: winnerColor }]}>
            <Text style={styles.winnerText}>🎉 {winnerName} Wins! 🎉</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.statsTitle}>Game Statistics</Text>

            {score && (
              <>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Result Type:</Text>
                  <Text style={styles.statValue}>{getResultTypeLabel(score.resultType)}</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Cube Value:</Text>
                  <Text style={styles.statValue}>{score.cubeValue}</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Final Score:</Text>
                  <Text style={[styles.statValue, styles.scoreValue]}>{score.finalScore}</Text>
                </View>
              </>
            )}

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Moves:</Text>
              <Text style={styles.statValue}>{statistics.moves}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Game Duration:</Text>
              <Text style={styles.statValue}>{formatDuration(statistics.duration)}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>White Checkers Borne Off:</Text>
              <Text style={styles.statValue}>{statistics.whiteBorneOff} / 15</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Black Checkers Borne Off:</Text>
              <Text style={styles.statValue}>{statistics.blackBorneOff} / 15</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.newGameButton]}
              onPress={onNewGame}
            >
              <Text style={styles.buttonText}>New Game</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#D2B48C',
    borderRadius: 20,
    padding: 0,
    width: '80%',
    maxWidth: 400,
    borderWidth: 3,
    borderColor: '#8B4513',
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#8B4513',
  },
  statLabel: {
    fontSize: 16,
    color: '#654321',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  scoreValue: {
    fontSize: 22,
    color: '#654321',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newGameButton: {
    backgroundColor: '#8B4513',
  },
  closeButton: {
    backgroundColor: '#654321',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WinModal;
