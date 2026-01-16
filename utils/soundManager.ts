import { Audio } from 'expo-av';

let soundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

const playSound = async (soundSource: any, volume: number) => {
  if (!soundEnabled) return;
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 2000)
    );
    const soundPromise = Audio.Sound.createAsync(soundSource, {
      shouldPlay: true,
      volume,
    });
    const { sound } = await Promise.race([soundPromise, timeoutPromise]) as any;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
  }
};

export const playDiceRollSound = async () => {
  await playSound(
    { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
    0.5
  );
};

export const playMoveSound = async () => {
  await playSound(
    { uri: 'https://www.soundjay.com/misc/sounds/click-09.wav' },
    0.3
  );
};

export const playHitSound = async () => {
  await playSound(
    { uri: 'https://www.soundjay.com/misc/sounds/click-10.wav' },
    0.6
  );
};

export const playWinSound = async () => {
  await playSound(
    { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
    0.7
  );
};

export const playErrorSound = async () => {
  await playSound(
    { uri: 'https://www.soundjay.com/misc/sounds/beep-07a.wav' },
    0.4
  );
};
