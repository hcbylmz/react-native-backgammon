import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface DoublingCubeProps {
  cubeValue: number;
  cubeOwner: number | null;
  currentPlayer: number;
  pendingDouble: number | null;
  canDouble: boolean;
  onOfferDouble: () => void;
  onAcceptDouble: () => void;
  onRejectDouble: () => void;
  gameEnded: boolean;
}

const DoublingCube: React.FC<DoublingCubeProps> = ({
  cubeValue,
  cubeOwner,
  currentPlayer,
  pendingDouble,
  canDouble,
  onOfferDouble,
  onAcceptDouble,
  onRejectDouble,
  gameEnded,
}) => {
  const ownerName = cubeOwner && cubeOwner > 0 ? 'White' : cubeOwner && cubeOwner < 0 ? 'Black' : null;

  if (pendingDouble !== null) {
    const doublerName = pendingDouble > 0 ? 'White' : 'Black';
    return (
      <View style={styles.container}>
        <View style={styles.pendingContainer}>
          <Text style={styles.pendingText}>{doublerName} offers to double</Text>
          <Text style={styles.cubeValueText}>Cube: {cubeValue * 2}</Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.acceptButton]}
              onPress={onAcceptDouble}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.rejectButton]}
              onPress={onRejectDouble}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cubeContainer}>
        <View style={styles.cube}>
          <Text style={styles.cubeNumber}>{cubeValue}</Text>
        </View>
        {ownerName && (
          <Text style={styles.ownerText}>Owned by {ownerName}</Text>
        )}
        {!gameEnded && canDouble && (
          <Pressable
            style={styles.doubleButton}
            onPress={onOfferDouble}
          >
            <Text style={styles.doubleButtonText}>Double</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  cubeContainer: {
    alignItems: 'center',
    gap: 4,
  },
  cube: {
    width: 50,
    height: 50,
    backgroundColor: '#8B4513',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#654321',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cubeNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ownerText: {
    fontSize: 10,
    color: '#654321',
    fontWeight: '500',
  },
  doubleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#8B4513',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#654321',
  },
  doubleButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pendingContainer: {
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#D2B48C',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B4513',
    minWidth: 150,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#654321',
    textAlign: 'center',
  },
  cubeValueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DoublingCube;
