import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import GameInfoPanel from './GameInfoPanel';
import MoveHistory from './MoveHistory';
import BaseModal from './BaseModal';

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
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Game Information"
      animationType="none"
    >
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
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 500,
  },
  moveHistoryContainer: {
    marginTop: 16,
    width: '100%',
  },
});

export default GameInfoModal;
