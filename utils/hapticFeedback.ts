import * as Haptics from 'expo-haptics';

let hapticEnabled = true;

export const setHapticEnabled = (enabled: boolean) => {
  hapticEnabled = enabled;
};

export const triggerMoveHaptic = async () => {
  if (!hapticEnabled) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    console.error('Error triggering haptic:', error);
  }
};

export const triggerErrorHaptic = async () => {
  if (!hapticEnabled) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.error('Error triggering error haptic:', error);
  }
};

export const triggerHitHaptic = async () => {
  if (!hapticEnabled) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.error('Error triggering hit haptic:', error);
  }
};

export const triggerWinHaptic = async () => {
  if (!hapticEnabled) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.error('Error triggering win haptic:', error);
  }
};
