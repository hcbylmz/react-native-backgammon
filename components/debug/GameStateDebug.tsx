import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
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
}

const GameStateDebug: React.FC<GameStateDebugProps> = ({ onSetGameState }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
        animationType="fade"
        supportedOrientations={['landscape-left', 'landscape-right']}
        onRequestClose={() => setIsExpanded(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsExpanded(false)}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Game State Debug</Text>
              <Pressable onPress={() => setIsExpanded(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

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
          </Pressable>
        </Pressable>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#555',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxWidth: 300,
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
});

export default GameStateDebug;