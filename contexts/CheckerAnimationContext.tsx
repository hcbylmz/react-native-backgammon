import React, { createContext, useContext, ReactNode } from 'react';
import { useCheckerMoveAnimation } from '../hooks/useCheckerMoveAnimation';

interface CheckerAnimationContextType {
  activeAnimation: ReturnType<typeof useCheckerMoveAnimation>['activeAnimation'];
  animateMove: ReturnType<typeof useCheckerMoveAnimation>['animateMove'];
  translateX: ReturnType<typeof useCheckerMoveAnimation>['translateX'];
  translateY: ReturnType<typeof useCheckerMoveAnimation>['translateY'];
  scale: ReturnType<typeof useCheckerMoveAnimation>['scale'];
  opacity: ReturnType<typeof useCheckerMoveAnimation>['opacity'];
}

const CheckerAnimationContext = createContext<CheckerAnimationContextType | undefined>(undefined);

export const CheckerAnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const animation = useCheckerMoveAnimation();

  return (
    <CheckerAnimationContext.Provider value={animation}>
      {children}
    </CheckerAnimationContext.Provider>
  );
};

export const useCheckerAnimation = () => {
  const context = useContext(CheckerAnimationContext);
  if (!context) {
    throw new Error('useCheckerAnimation must be used within CheckerAnimationProvider');
  }
  return context;
};
