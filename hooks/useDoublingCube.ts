import { useState } from 'react';

export const useDoublingCube = () => {
  const [cubeValue, setCubeValue] = useState<number>(1);
  const [cubeOwner, setCubeOwner] = useState<number | null>(null);
  const [pendingDouble, setPendingDouble] = useState<number | null>(null);

  const canDouble = (currentPlayer: number): boolean => {
    if (pendingDouble !== null) return false;
    if (cubeOwner === currentPlayer) return false;
    return cubeValue < 64;
  };

  const offerDouble = (player: number): void => {
    if (canDouble(player)) {
      setPendingDouble(player);
    }
  };

  const acceptDouble = (): void => {
    if (pendingDouble === null) return;
    
    const newValue = Math.min(cubeValue * 2, 64);
    setCubeValue(newValue);
    setCubeOwner(pendingDouble);
    setPendingDouble(null);
  };

  const rejectDouble = (): void => {
    setPendingDouble(null);
  };

  const resetCube = (): void => {
    setCubeValue(1);
    setCubeOwner(null);
    setPendingDouble(null);
  };

  const setCubeOwnerValue = (owner: number | null): void => {
    setCubeOwner(owner);
  };

  return {
    cubeValue,
    cubeOwner,
    pendingDouble,
    canDouble,
    offerDouble,
    acceptDouble,
    rejectDouble,
    resetCube,
    setCubeValue,
    setCubeOwner: setCubeOwnerValue,
  };
};
