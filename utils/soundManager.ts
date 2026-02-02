import { Audio } from 'expo-av';

let soundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

const playSound = async (soundSource: any, volume: number) => {
  if (!soundEnabled) return;
  try {
    const { sound } = await Audio.Sound.createAsync(soundSource, {
      shouldPlay: true,
      volume,
    });
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
  }
};

let diceRollSound: any = null;
let moveSound: any = null;
let hitSound: any = null;
let winSound: any = null;
let errorSound: any = null;

try {
  diceRollSound = require('../assets/sounds/dice-roll.mp3');
} catch {}

// try {
//   moveSound = require('../assets/sounds/move.mp3');
// } catch {}

// try {
//   hitSound = require('../assets/sounds/hit.mp3');
// } catch {}

// try {
//   winSound = require('../assets/sounds/win.mp3');
// } catch {}

// try {
//   errorSound = require('../assets/sounds/error.mp3');
// } catch {}

export const playDiceRollSound = async () => {
  if (diceRollSound) {
    await playSound(diceRollSound, 0.5);
  }
};

export const playMoveSound = async () => {
  if (moveSound) {
    await playSound(moveSound, 0.3);
  }
};

export const playHitSound = async () => {
  if (hitSound) {
    await playSound(hitSound, 0.6);
  }
};

export const playWinSound = async () => {
  if (winSound) {
    await playSound(winSound, 0.7);
  }
};

export const playErrorSound = async () => {
  if (errorSound) {
    await playSound(errorSound, 0.4);
  }
};
