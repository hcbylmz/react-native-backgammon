import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import { Point } from '../../types/game';
import { getInitialPoints } from '../../utils/gameLogic';

interface GameStateDebugProps {
  onSetGameState: (
    boardPoints: Point[],
    whiteBar: number,
    blackBar: number,
    whiteBorneOff: number,
    blackBorneOff: number,
    currentPlayer: number
  ) => void;
  dice1: number;
  dice2: number;
  onSetDice: (dice1: number, dice2: number) => void;
  onResetGame: () => void;
}

const GameStateDebug: React.FC<GameStateDebugProps> = ({ onSetGameState, dice1, dice2, onSetDice, onResetGame }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [diceInput1, setDiceInput1] = useState<string>('');
  const [diceInput2, setDiceInput2] = useState<string>('');

  const createEmptyBoard = (): Point[] => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      checkers: 0,
    }));
  };

  const getStartingPosition = (): { points: Point[]; whiteBar: number; blackBar: number; whiteBorneOff: number; blackBorneOff: number } => {
    const points = getInitialPoints();
    return {
      points,
      whiteBar: 0,
      blackBar: 0,
      whiteBorneOff: 0,
      blackBorneOff: 0,
    };
  };

  const getMidGamePosition = (): { points: Point[]; whiteBar: number; blackBar: number; whiteBorneOff: number; blackBorneOff: number } => {
    const points = createEmptyBoard();
    let whiteCheckers = 15;
    let blackCheckers = 15;

    const randomPoints = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    
    while (whiteCheckers > 0 || blackCheckers > 0) {
      const randomPointId = randomPoints[Math.floor(Math.random() * randomPoints.length)];
      const point = points.find(p => p.id === randomPointId);
      if (!point) continue;

      if (whiteCheckers > 0 && Math.random() > 0.5) {
        point.checkers += 1;
        whiteCheckers--;
      } else if (blackCheckers > 0) {
        point.checkers -= 1;
        blackCheckers--;
      }
    }

    const whiteBar = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
    const blackBar = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;

    return {
      points,
      whiteBar,
      blackBar,
      whiteBorneOff: 0,
      blackBorneOff: 0,
    };
  };

  const getNearlyEndPosition = (): { points: Point[]; whiteBar: number; blackBar: number; whiteBorneOff: number; blackBorneOff: number } => {
    const points = createEmptyBoard();
    
    const whiteHomeBoard = [1, 2, 3, 4, 5, 6];
    const blackHomeBoard = [19, 20, 21, 22, 23, 24];
    
    let whiteCheckers = 8;
    let blackCheckers = 8;
    let whiteBorneOff = 7;
    let blackBorneOff = 7;

    while (whiteCheckers > 0) {
      const randomPointId = whiteHomeBoard[Math.floor(Math.random() * whiteHomeBoard.length)];
      const point = points.find(p => p.id === randomPointId);
      if (point) {
        point.checkers += 1;
        whiteCheckers--;
      }
    }

    while (blackCheckers > 0) {
      const randomPointId = blackHomeBoard[Math.floor(Math.random() * blackHomeBoard.length)];
      const point = points.find(p => p.id === randomPointId);
      if (point) {
        point.checkers -= 1;
        blackCheckers--;
      }
    }

    return {
      points,
      whiteBar: 0,
      blackBar: 0,
      whiteBorneOff,
      blackBorneOff,
    };
  };

  const getCustomPosition = (totalCheckers: number): { points: Point[]; whiteBar: number; blackBar: number; whiteBorneOff: number; blackBorneOff: number } => {
    const points = createEmptyBoard();
    const whiteCheckers = Math.floor(totalCheckers / 2);
    const blackCheckers = totalCheckers - whiteCheckers;

    const randomPoints = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    
    let whiteRemaining = whiteCheckers;
    let blackRemaining = blackCheckers;
    
    while (whiteRemaining > 0 || blackRemaining > 0) {
      const randomPointId = randomPoints[Math.floor(Math.random() * randomPoints.length)];
      const point = points.find(p => p.id === randomPointId);
      if (!point) continue;

      if (whiteRemaining > 0 && Math.random() > 0.5) {
        point.checkers += 1;
        whiteRemaining--;
      } else if (blackRemaining > 0) {
        point.checkers -= 1;
        blackRemaining--;
      }
    }

    return {
      points,
      whiteBar: 0,
      blackBar: 0,
      whiteBorneOff: 0,
      blackBorneOff: 0,
    };
  };

  const handleSetStarting = () => {
    const state = getStartingPosition();
    onSetGameState(state.points, state.whiteBar, state.blackBar, state.whiteBorneOff, state.blackBorneOff, 1);
  };

  const handleSetMidGame = () => {
    const state = getMidGamePosition();
    onSetGameState(state.points, state.whiteBar, state.blackBar, state.whiteBorneOff, state.blackBorneOff, 1);
  };

  const handleSetNearlyEnd = () => {
    const state = getNearlyEndPosition();
    onSetGameState(state.points, state.whiteBar, state.blackBar, state.whiteBorneOff, state.blackBorneOff, 1);
  };

  const handleSetCustom = (totalCheckers: number) => {
    const state = getCustomPosition(totalCheckers);
    onSetGameState(state.points, state.whiteBar, state.blackBar, state.whiteBorneOff, state.blackBorneOff, 1);
  };

  const handleDiceSet = () => {
    const val1 = parseInt(diceInput1, 10);
    const val2 = parseInt(diceInput2, 10);

    if (val1 >= 1 && val1 <= 6 && val2 >= 1 && val2 <= 6) {
      onSetDice(val1, val2);
      setDiceInput1('');
      setDiceInput2('');
    }
  };

  return (
    <>
      <Pressable
        style={styles.iconButton}
        onPress={() => setIsExpanded(true)}
      >
        <Text style={styles.iconText}>⚙️</Text>
      </Pressable>

      <Modal
        visible={isExpanded}
        transparent={true}
        animationType="none"
        supportedOrientations={['landscape-left', 'landscape-right']}
        onRequestClose={() => setIsExpanded(false)}
      >
        <View style={styles.modalOverlayContainer}>
          <View style={styles.modalOverlay} />
          <Pressable 
            style={StyleSheet.absoluteFill}
            onPress={() => setIsExpanded(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Debug Settings</Text>
              <Pressable onPress={() => setIsExpanded(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            <ScrollView 
              style={styles.scrollView} 
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.scrollContent}
              nestedScrollEnabled={true}
            >
              <Text style={styles.label}>Manual Dice Entry</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={diceInput1}
                  onChangeText={setDiceInput1}
                  placeholder="Dice 1 (1-6)"
                  keyboardType="numeric"
                  maxLength={1}
                  placeholderTextColor="#999"
                />
                <TextInput
                  style={styles.input}
                  value={diceInput2}
                  onChangeText={setDiceInput2}
                  placeholder="Dice 2 (1-6)"
                  keyboardType="numeric"
                  maxLength={1}
                  placeholderTextColor="#999"
                />
              </View>
              <Pressable style={styles.button} onPress={handleDiceSet}>
                <Text style={styles.buttonText}>Set Dice</Text>
              </Pressable>
              <Text style={styles.currentDiceText}>Current: {dice1 > 0 ? dice1 : '-'} / {dice2 > 0 ? dice2 : '-'}</Text>

              <View style={styles.divider} />

              <Pressable style={styles.resetButton} onPress={() => { onResetGame(); setIsExpanded(false); }}>
                <Text style={styles.buttonText}>Reset Game</Text>
              </Pressable>

              <View style={styles.divider} />

              <Text style={styles.label}>Preset Positions</Text>
            
            <Pressable style={styles.button} onPress={() => { handleSetStarting(); setIsExpanded(false); }}>
              <Text style={styles.buttonText}>Starting Position</Text>
            </Pressable>
            
            <Pressable style={styles.button} onPress={() => { handleSetMidGame(); setIsExpanded(false); }}>
              <Text style={styles.buttonText}>Mid Game</Text>
            </Pressable>
            
            <Pressable style={styles.button} onPress={() => { handleSetNearlyEnd(); setIsExpanded(false); }}>
              <Text style={styles.buttonText}>Nearly End (Bearing Off)</Text>
            </Pressable>
            
            <Text style={styles.label}>Custom Checker Count</Text>
            
            <View style={styles.buttonRow}>
              <Pressable style={styles.smallButton} onPress={() => { handleSetCustom(10); setIsExpanded(false); }}>
                <Text style={styles.buttonText}>10</Text>
              </Pressable>
              <Pressable style={styles.smallButton} onPress={() => { handleSetCustom(20); setIsExpanded(false); }}>
                <Text style={styles.buttonText}>20</Text>
              </Pressable>
              <Pressable style={styles.smallButton} onPress={() => { handleSetCustom(30); setIsExpanded(false); }}>
                <Text style={styles.buttonText}>30</Text>
              </Pressable>
            </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  iconText: {
    fontSize: 18,
  },
  modalOverlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#555',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxWidth: 300,
    maxHeight: '80%',
  },
  scrollView: {
    minHeight: 200,
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginVertical: 4,
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  smallButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    height: 32,
    textAlign: 'center',
    fontSize: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    color: '#000',
  },
  currentDiceText: {
    color: '#FFF',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: '#777',
    marginVertical: 12,
  },
  resetButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginVertical: 4,
    width: '100%',
    alignItems: 'center',
  },
});

export default GameStateDebug;