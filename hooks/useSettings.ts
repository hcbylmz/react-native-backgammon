import { useState, useEffect, useCallback } from 'react';
import { loadSettings, saveSettings, updateSetting, GameSettings } from '../utils/settingsStorage';

export const useSettings = () => {
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSettings = async () => {
      setLoading(true);
      try {
        const loadedSettings = await loadSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Error initializing settings:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeSettings();
  }, []);

  const update = useCallback(async <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ): Promise<boolean> => {
    if (!settings) return false;
    
    const success = await updateSetting(key, value);
    if (success) {
      const newSettings = settings ? { ...settings, [key]: value } : null;
      setSettings(newSettings);
    }
    return success;
  }, [settings]);

  const save = useCallback(async (newSettings: GameSettings): Promise<boolean> => {
    const success = await saveSettings(newSettings);
    if (success) {
      setSettings(newSettings);
    }
    return success;
  }, []);

  const reload = useCallback(async () => {
    try {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
      return true;
    } catch (error) {
      console.error('Error reloading settings:', error);
      return false;
    }
  }, []);

  return {
    settings,
    loading,
    update,
    save,
    reload,
  };
};
