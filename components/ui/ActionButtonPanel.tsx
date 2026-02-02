import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';

interface ActionButtonPanelProps {
  onInfoPress: () => void;
  onSettingsPress: () => void;
  onHistoryPress: () => void;
  onRulesPress: () => void;
  onFAQPress: () => void;
  onSaveLoadPress: () => void;
  onUndoPress: () => void;
  canUndo: boolean;
}

const ActionButtonPanel: React.FC<ActionButtonPanelProps> = ({
  onInfoPress,
  onSettingsPress,
  onHistoryPress,
  onRulesPress,
  onFAQPress,
  onSaveLoadPress,
  onUndoPress,
  canUndo,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={onInfoPress}
      >
        <Text style={styles.icon}>ℹ️</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onSettingsPress}
      >
        <Text style={styles.icon}>⚙️</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onHistoryPress}
      >
        <Text style={styles.icon}>📜</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onRulesPress}
      >
        <Text style={styles.icon}>📖</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onFAQPress}
      >
        <Text style={styles.icon}>❓</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onSaveLoadPress}
      >
        <Text style={styles.icon}>💾</Text>
      </Pressable>

      {canUndo && (
        <Pressable
          style={styles.button}
          onPress={onUndoPress}
        >
          <Text style={styles.icon}>↶</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignSelf: 'stretch',
    maxHeight: '100%',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#654321',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    fontSize: 24,
  },
});

export default ActionButtonPanel;
