import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { GameSettings } from '../../utils/settingsStorage';
import BaseModal from '../ui/BaseModal';

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  visible, 
  onClose,
}) => {
  const { settings, loading, update } = useSettings();
  const [localSettings, setLocalSettings] = useState<GameSettings | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSettingChange = async <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    if (localSettings) {
      const updated = { ...localSettings, [key]: value };
      setLocalSettings(updated);
      await update(key, value);
    }
  };

  if (loading || !localSettings) {
    return (
      <BaseModal
        visible={visible}
        onClose={onClose}
        title="Settings"
        animationType="none"
      >
        <Text>Loading settings...</Text>
      </BaseModal>
    );
  }

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Settings"
      animationType="none"
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Gameplay Settings Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Gameplay Settings</Text>
                <View style={styles.sectionDivider} />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Player 1 (White):</Text>
                <TextInput
                  style={styles.input}
                  value={localSettings.player1Name}
                  onChangeText={(text) => handleSettingChange('player1Name', text)}
                  placeholder="Player 1"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Player 2 (Black):</Text>
                <TextInput
                  style={styles.input}
                  value={localSettings.player2Name}
                  onChangeText={(text) => handleSettingChange('player2Name', text)}
                  placeholder="Player 2"
                  placeholderTextColor="#999"
                />
              </View>
              <Pressable
                style={[styles.toggleButton, localSettings.showMoveHints && styles.toggleButtonActive]}
                onPress={() => handleSettingChange('showMoveHints', !localSettings.showMoveHints)}
              >
                <View style={styles.toggleContent}>
                  <Text style={styles.toggleText}>Show Move Hints</Text>
                  <View style={[styles.toggleSwitch, localSettings.showMoveHints && styles.toggleSwitchActive]}>
                    <Text style={styles.toggleSwitchText}>{localSettings.showMoveHints ? 'ON' : 'OFF'}</Text>
                  </View>
                </View>
              </Pressable>
            </View>

            {/* Display Settings Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Display Settings</Text>
                <View style={styles.sectionDivider} />
              </View>
              <Text style={styles.subsectionLabel}>Board Theme</Text>
              <View style={styles.optionGroup}>
                {(['light', 'dark', 'classic'] as const).map((theme) => (
                  <Pressable
                    key={theme}
                    style={[
                      styles.optionButton,
                      localSettings.theme === theme && styles.optionButtonActive,
                    ]}
                    onPress={() => handleSettingChange('theme', theme)}
                  >
                    <Text style={styles.optionText}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.subsectionLabel}>Animation Speed</Text>
              <View style={styles.optionGroup}>
                {(['slow', 'normal', 'fast'] as const).map((speed) => (
                  <Pressable
                    key={speed}
                    style={[
                      styles.optionButton,
                      localSettings.animationSpeed === speed && styles.optionButtonActive,
                    ]}
                    onPress={() => handleSettingChange('animationSpeed', speed)}
                  >
                    <Text style={styles.optionText}>{speed.charAt(0).toUpperCase() + speed.slice(1)}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Audio & Feedback Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Audio & Feedback</Text>
                <View style={styles.sectionDivider} />
              </View>
              <Pressable
                style={[styles.toggleButton, localSettings.soundEnabled && styles.toggleButtonActive]}
                onPress={() => handleSettingChange('soundEnabled', !localSettings.soundEnabled)}
              >
                <View style={styles.toggleContent}>
                  <Text style={styles.toggleText}>Sound Effects</Text>
                  <View style={[styles.toggleSwitch, localSettings.soundEnabled && styles.toggleSwitchActive]}>
                    <Text style={styles.toggleSwitchText}>{localSettings.soundEnabled ? 'ON' : 'OFF'}</Text>
                  </View>
                </View>
              </Pressable>
              <Pressable
                style={[styles.toggleButton, localSettings.hapticEnabled && styles.toggleButtonActive]}
                onPress={() => handleSettingChange('hapticEnabled', !localSettings.hapticEnabled)}
              >
                <View style={styles.toggleContent}>
                  <Text style={styles.toggleText}>Haptic Feedback</Text>
                  <View style={[styles.toggleSwitch, localSettings.hapticEnabled && styles.toggleSwitchActive]}>
                    <Text style={styles.toggleSwitchText}>{localSettings.hapticEnabled ? 'ON' : 'OFF'}</Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </ScrollView>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 500,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: '#8B4513',
    borderRadius: 1,
    opacity: 0.3,
  },
  subsectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#654321',
    marginBottom: 8,
    marginTop: 4,
  },
  optionGroup: {
    gap: 8,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#654321',
    minWidth: 120,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5E6D3',
    borderWidth: 2,
    borderColor: '#8B4513',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#654321',
    minHeight: 44,
  },
  toggleButton: {
    padding: 14,
    backgroundColor: '#F5E6D3',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B4513',
    marginBottom: 10,
    minHeight: 48,
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  toggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 15,
    color: '#654321',
    fontWeight: '600',
    flex: 1,
  },
  toggleSwitch: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#CCCCCC',
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#4CAF50',
  },
  toggleSwitchText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  optionButton: {
    padding: 14,
    backgroundColor: '#F5E6D3',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B4513',
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  optionText: {
    fontSize: 15,
    color: '#654321',
    fontWeight: '600',
  },
});

export default SettingsScreen;
