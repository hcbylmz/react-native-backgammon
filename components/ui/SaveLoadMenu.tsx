import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { SavedGameState } from '../../utils/gameStorage';

interface SaveLoadMenuProps {
  visible: boolean;
  savedGames: Array<{ slot: number; timestamp: number }>;
  loading: boolean;
  onSave: (slot: number) => void;
  onLoad: (slot: number) => void;
  onDelete: (slot: number) => void;
  onClose: () => void;
}

const SaveLoadMenu: React.FC<SaveLoadMenuProps> = ({
  visible,
  savedGames,
  loading,
  onSave,
  onLoad,
  onDelete,
  onClose,
}) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getSlotInfo = (slot: number) => {
    return savedGames.find(g => g.slot === slot);
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
          <Text style={styles.title}>Save / Load Game</Text>
          
          <ScrollView style={styles.scrollView}>
            {Array.from({ length: 5 }, (_, i) => i + 1).map(slot => {
              const gameInfo = getSlotInfo(slot);
              const isEmpty = !gameInfo;
              
              return (
                <View key={slot} style={styles.slotContainer}>
                  <View style={styles.slotHeader}>
                    <Text style={styles.slotLabel}>Slot {slot}</Text>
                    {gameInfo && (
                      <Text style={styles.slotDate}>{formatDate(gameInfo.timestamp)}</Text>
                    )}
                  </View>
                  
                  <View style={styles.buttonRow}>
                    {isEmpty ? (
                      <Pressable
                        style={[styles.button, styles.saveButton]}
                        onPress={() => onSave(slot)}
                        disabled={loading}
                      >
                        <Text style={styles.buttonText}>Save</Text>
                      </Pressable>
                    ) : (
                      <>
                        <Pressable
                          style={[styles.button, styles.loadButton]}
                          onPress={() => onLoad(slot)}
                          disabled={loading}
                        >
                          <Text style={styles.buttonText}>Load</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.button, styles.saveButton]}
                          onPress={() => onSave(slot)}
                          disabled={loading}
                        >
                          <Text style={styles.buttonText}>Overwrite</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.button, styles.deleteButton]}
                          onPress={() => onDelete(slot)}
                          disabled={loading}
                        >
                          <Text style={styles.buttonText}>Delete</Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
          
          <Pressable
            style={[styles.button, styles.closeButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
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
    width: '80%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 400,
  },
  slotContainer: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F5E6D3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#654321',
  },
  slotDate: {
    fontSize: 10,
    color: '#654321',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  loadButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  closeButton: {
    backgroundColor: '#8B4513',
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SaveLoadMenu;
