import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import GameInfoPanel from './GameInfoPanel';
import MoveHistory from './MoveHistory';

interface Move {
  from: number | null;
  to: number;
  player: number;
  moveNumber: number;
}

interface GameInfoModalProps {
  visible: boolean;
  onClose: () => void;
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
  moves?: Move[];
}

const GameInfoModal: React.FC<GameInfoModalProps> = ({
  visible,
  onClose,
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
  moves = [],
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      supportedOrientations={['landscape-left', 'landscape-right']}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Game Information</Text>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <GameInfoPanel
              currentPlayer={currentPlayer}
              cubeValue={cubeValue}
              cubeOwner={cubeOwner}
              player1Name={player1Name}
              player2Name={player2Name}
              moveCount={moveCount}
              turnNumber={turnNumber}
              elapsedTime={elapsedTime}
              moveTime={moveTime}
              formatTime={formatTime}
            />
            <View style={styles.moveHistoryContainer}>
              <MoveHistory moves={moves} />
            </View>
          </ScrollView>
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
    padding: 20,
    width: '90%',
    maxWidth: 600,
    maxHeight: '85%',
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#8B4513',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  scrollView: {
    maxHeight: 500,
  },
  moveHistoryContainer: {
    marginTop: 16,
    width: '100%',
  },
});

export default GameInfoModal;
