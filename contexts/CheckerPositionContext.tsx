import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Position } from '../hooks/useCheckerMoveAnimation';

interface PositionMap {
  [key: string]: Position;
}

interface CheckerPositionContextType {
  setPosition: (key: string, position: Position) => void;
  getPosition: (key: string) => Position | undefined;
  setContainerOffset: (offset: { x: number; y: number }) => void;
}

const CheckerPositionContext = createContext<CheckerPositionContextType | undefined>(undefined);

export const CheckerPositionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [positions, setPositions] = useState<PositionMap>({});
  const [containerOffset, setContainerOffsetState] = useState({ x: 0, y: 0 });

  const setPosition = useCallback((key: string, position: Position) => {
    setPositions(prev => ({ ...prev, [key]: position }));
  }, []);

  const setContainerOffset = useCallback((offset: { x: number; y: number }) => {
    setContainerOffsetState(offset);
  }, []);

  const getPosition = useCallback((key: string) => {
    const position = positions[key];
    if (!position) {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/e69eed9a-26a8-4b0c-af5e-6b7b0a93fd43',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CheckerPositionContext.tsx:getPosition',message:'Position not found',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      return undefined;
    }

    const isFromContainer = key.startsWith('point-') || key.startsWith('bar-');
    if (isFromContainer) {
      const borderWidth = 3;
      const padding = 6;
      const transformedX = position.x + containerOffset.x + borderWidth + padding;
      const transformedY = position.y + containerOffset.y + borderWidth + padding;
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/e69eed9a-26a8-4b0c-af5e-6b7b0a93fd43',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CheckerPositionContext.tsx:getPosition',message:'Position transformed',data:{key,rawX:position.x,rawY:position.y,containerOffsetX:containerOffset.x,containerOffsetY:containerOffset.y,transformedX,transformedY,width:position.width,height:position.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return {
        ...position,
        x: transformedX,
        y: transformedY,
      };
    }

    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/e69eed9a-26a8-4b0c-af5e-6b7b0a93fd43',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CheckerPositionContext.tsx:getPosition',message:'Position returned without transformation',data:{key,x:position.x,y:position.y,width:position.width,height:position.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return position;
  }, [positions, containerOffset]);

  return (
    <CheckerPositionContext.Provider value={{ setPosition, getPosition, setContainerOffset }}>
      {children}
    </CheckerPositionContext.Provider>
  );
};

export const useCheckerPosition = () => {
  const context = useContext(CheckerPositionContext);
  if (!context) {
    throw new Error('useCheckerPosition must be used within CheckerPositionProvider');
  }
  return context;
};
