import { useState } from 'react';

export const useDice = () => {
  const [dice1, setDice1] = useState<number>(0);
  const [dice2, setDice2] = useState<number>(0);
  const [usedDice, setUsedDice] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const newDice1 = Math.floor(Math.random() * 6) + 1;
      const newDice2 = Math.floor(Math.random() * 6) + 1;
      setDiceValues(newDice1, newDice2);
    }, 500);
  };

  const setDiceValues = (newDice1: number, newDice2: number) => {
    setDice1(newDice1);
    setDice2(newDice2);
    setUsedDice([]);
    setIsRolling(false);
  };

  const getAvailableDice = (): number[] => {
    if (dice1 === 0 || dice2 === 0) return [];
    
    const available: number[] = [];
    
    if (dice1 === dice2) {
      const total = 4;
      const used = usedDice.filter(d => d === dice1).length;
      const remaining = total - used;
      for (let i = 0; i < remaining; i++) {
        available.push(dice1);
      }
    } else {
      const used1 = usedDice.filter(d => d === dice1).length;
      const used2 = usedDice.filter(d => d === dice2).length;
      
      if (used1 === 0) available.push(dice1);
      if (used2 === 0) available.push(dice2);
    }
    
    return available;
  };

  const getAvailableDiceAfterMove = (usedDiceAfterMove: number[]): number[] => {
    if (dice1 === 0 || dice2 === 0) return [];
    
    const available: number[] = [];
    
    if (dice1 === dice2) {
      const total = 4;
      const used = usedDiceAfterMove.filter(d => d === dice1).length;
      const remaining = total - used;
      for (let i = 0; i < remaining; i++) {
        available.push(dice1);
      }
    } else {
      const used1 = usedDiceAfterMove.filter(d => d === dice1).length;
      const used2 = usedDiceAfterMove.filter(d => d === dice2).length;
      
      if (used1 === 0) available.push(dice1);
      if (used2 === 0) available.push(dice2);
    }
    
    return available;
  };

  const markDiceAsUsed = (diceValues: number[]) => {
    setUsedDice(prev => [...prev, ...diceValues]);
  };

  const setUsedDiceDirectly = (dice: number[]) => {
    setUsedDice(dice);
  };

  const resetDice = () => {
    setDice1(0);
    setDice2(0);
    setUsedDice([]);
    setIsRolling(false);
  };

  const allDiceUsed = (): boolean => {
    if (dice1 === 0 || dice2 === 0) return false;
    return usedDice.length >= (dice1 === dice2 ? 4 : 2);
  };

  return {
    dice1,
    dice2,
    usedDice,
    isRolling,
    rollDice,
    setDiceValues,
    getAvailableDice,
    getAvailableDiceAfterMove,
    markDiceAsUsed,
    setUsedDice: setUsedDiceDirectly,
    resetDice,
    allDiceUsed,
  };
};
