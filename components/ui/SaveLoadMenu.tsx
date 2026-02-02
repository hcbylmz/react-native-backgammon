import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SavedGameState } from '../../utils/gameStorage';
import BaseModal from './BaseModal';

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
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Save / Load Game"
      animationType="none"
      containerStyle={styles.modalContainer}
    >
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
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: '80%',
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SaveLoadMenu;
