import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface DiceDebugProps {
  dice1: number;
  dice2: number;
  onSetDice: (dice1: number, dice2: number) => void;
}

const DiceDebug: React.FC<DiceDebugProps> = ({ dice1, dice2, onSetDice }) => {
  const [input1, setInput1] = useState<string>('');
  const [input2, setInput2] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSetDice = () => {
    const val1 = parseInt(input1, 10);
    const val2 = parseInt(input2, 10);

    if (val1 >= 1 && val1 <= 6 && val2 >= 1 && val2 <= 6) {
      onSetDice(val1, val2);
      setInput1('');
      setInput2('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.toggleText}>Debug</Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.debugPanel}>
          <Text style={styles.label}>Manual Dice Entry</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input1}
              onChangeText={setInput1}
              placeholder="Dice 1 (1-6)"
              keyboardType="numeric"
              maxLength={1}
            />
            <TextInput
              style={styles.input}
              value={input2}
              onChangeText={setInput2}
              placeholder="Dice 2 (1-6)"
              keyboardType="numeric"
              maxLength={1}
            />
          </View>
          <TouchableOpacity
            style={styles.setButton}
            onPress={handleSetDice}
          >
            <Text style={styles.setButtonText}>Set Dice</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  toggleButton: {
    backgroundColor: '#666',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'center',
  },
  toggleText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  debugPanel: {
    marginTop: 4,
    padding: 8,
    backgroundColor: '#555',
    borderRadius: 4,
    alignItems: 'center',
  },
  label: {
    color: '#FFF',
    fontSize: 9,
    marginBottom: 4,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFF',
    width: 50,
    height: 24,
    textAlign: 'center',
    fontSize: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  setButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  setButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default DiceDebug;
