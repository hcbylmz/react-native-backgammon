import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameSettings {
  soundEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  theme: 'light' | 'dark' | 'classic';
  player1Name: string;
  player2Name: string;
  hapticEnabled: boolean;
}

const SETTINGS_KEY = 'backgammon_settings';
const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  animationSpeed: 'normal',
  theme: 'classic',
  player1Name: 'White',
  player2Name: 'Black',
  hapticEnabled: true,
};

export const loadSettings = async (): Promise<GameSettings> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data) as Partial<GameSettings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: GameSettings): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const updateSetting = async <K extends keyof GameSettings>(
  key: K,
  value: GameSettings[K]
): Promise<boolean> => {
  try {
    const currentSettings = await loadSettings();
    const updatedSettings = { ...currentSettings, [key]: value };
    return await saveSettings(updatedSettings);
  } catch (error) {
    console.error('Error updating setting:', error);
    return false;
  }
};
