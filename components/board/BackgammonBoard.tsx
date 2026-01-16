import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { BackgammonBoardProps } from '../../types/game';
import { useGameState } from '../../hooks/useGameState';
import { useDice } from '../../hooks/useDice';
import { useMoveValidation } from '../../hooks/useMoveValidation';
import { usePointHandlers } from '../../hooks/usePointHandlers';
import { getLeftTopPoints, getLeftBottomPoints, getRightTopPoints, getRightBottomPoints } from '../../utils/boardUtils';
import Point from './Point';
import Bar from './Bar';
import BearingOffArea from './BearingOffArea';
import DoublingCube from './DoublingCube';
import SaveLoadMenu from '../ui/SaveLoadMenu';
import GameInfoModal from '../ui/GameInfoModal';
import SettingsScreen from '../settings/SettingsScreen';
import RulesScreen from '../help/RulesScreen';
import FAQScreen from '../help/FAQScreen';
import GameStateDebug from '../debug/GameStateDebug';
import WinModal from '../WinModal';
import { useDoublingCube } from '../../hooks/useDoublingCube';
import { useMoveHistory } from '../../hooks/useMoveHistory';
import { useGameSave } from '../../hooks/useGameSave';
import { useSound } from '../../hooks/useSound';
import { useHaptic } from '../../hooks/useHaptic';
import { useGameTimer } from '../../hooks/useGameTimer';
import { useSettings } from '../../hooks/useSettings';

const BackgammonBoard: React.FC<BackgammonBoardProps> = ({ points }) => {
  const gameState = useGameState(points);
  const dice = useDice();
  const doublingCube = useDoublingCube();
  const moveHistory = useMoveHistory();
  const gameSave = useGameSave();
  const sound = useSound();
  const haptic = useHaptic();
  const settings = useSettings();
  const gameTimer = useGameTimer({
    enabled: false,
    onTimeWarning: () => {
      Toast.show({
        type: 'warning',
        text1: 'Time Warning',
        text2: '10 seconds remaining for this move',
        position: 'top',
        visibilityTime: 2000,
      });
    },
  });
  
  const moveValidation = useMoveValidation({
    boardPoints: gameState.boardPoints,
    currentPlayer: gameState.currentPlayer,
    dice1: dice.dice1,
    dice2: dice.dice2,
    usedDice: dice.usedDice,
    whiteBar: gameState.whiteBar,
    blackBar: gameState.blackBar,
    whiteBorneOff: gameState.whiteBorneOff,
    blackBorneOff: gameState.blackBorneOff,
  });

  const { handlePointPress, handleBearingOffPress } = usePointHandlers(
    gameState,
    dice,
    moveValidation,
    moveHistory
  );

  useEffect(() => {
    gameState.setCubeValue(doublingCube.cubeValue);
  }, [doublingCube.cubeValue]);

  useEffect(() => {
    if (gameState.currentPlayer !== 0 && !gameState.gameEnded && doublingCube.pendingDouble === null) {
      dice.rollDice();
      sound.playDiceRoll();
      gameTimer.resetMoveTimer();
      if (gameState.currentPlayer === 1) {
        setTurnNumber(prev => prev + 1);
      }
    }
  }, [gameState.currentPlayer, gameState.gameEnded, doublingCube.pendingDouble]);

  const checkLegalMovesAfterDiceSet = (newDice1: number, newDice2: number) => {
    setTimeout(() => {
      const hasCrashed = gameState.hasCrashedPieces(gameState.currentPlayer);
      const legalMovesFromBar = hasCrashed 
        ? moveValidation.getLegalMovesFromBar(newDice1, newDice2, [], gameState.whiteBar, gameState.blackBar, gameState.boardPoints) 
        : [];
      const legalMovesFromBoard = !hasCrashed 
        ? moveValidation.getLegalMovesFromBoard(newDice1, newDice2, [], gameState.boardPoints) 
        : [];
      const hasLegalMoves = legalMovesFromBar.length > 0 || legalMovesFromBoard.length > 0;
      
      if (!hasLegalMoves && newDice1 > 0 && newDice2 > 0) {
        Toast.show({
          type: 'info',
          text1: 'No Legal Moves',
          text2: `${gameState.currentPlayer > 0 ? 'White' : 'Black'} has no legal moves. Switching player.`,
          position: 'top',
          visibilityTime: 2000,
        });
        setTimeout(() => {
          gameState.switchPlayer();
        }, 500);
      }
    }, 100);
  };

  const handleSetDice = (newDice1: number, newDice2: number) => {
    dice.setDiceValues(newDice1, newDice2);
    gameState.setSelectedFromBar(false);
    gameState.setSelectedPointId(null);
    checkLegalMovesAfterDiceSet(newDice1, newDice2);
  };


  const handleBarPress = () => {
    if (gameState.gameEnded) return;
    const hasCrashed = gameState.hasCrashedPieces(gameState.currentPlayer);
    if (hasCrashed) {
      gameState.setSelectedFromBar(true);
      gameState.setSelectedPointId(null);
    }
  };

  const [showWinModal, setShowWinModal] = useState(false);
  const [showSaveLoadMenu, setShowSaveLoadMenu] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [turnNumber, setTurnNumber] = useState(1);

  useEffect(() => {
    if (gameState.gameEnded && gameState.winner !== null) {
      setShowWinModal(true);
      sound.playWin();
      haptic.triggerWin();
      Toast.show({
        type: 'success',
        text1: 'Game Over!',
        text2: `${gameState.winner > 0 ? 'White' : 'Black'} has won the game!`,
        position: 'top',
        visibilityTime: 3000,
      });
    }
  }, [gameState.gameEnded, gameState.winner]);

  const handleResetGame = () => {
    gameState.resetGame();
    dice.resetDice();
    doublingCube.resetCube();
    moveHistory.clearHistory();
    setShowWinModal(false);
    setTurnNumber(1);
  };

  const handleUndo = () => {
    const snapshot = moveHistory.undo();
    if (snapshot) {
      gameState.setGameState(
        snapshot.boardPoints,
        snapshot.whiteBar,
        snapshot.blackBar,
        snapshot.whiteBorneOff,
        snapshot.blackBorneOff,
        snapshot.currentPlayer
      );
      dice.setDiceValues(snapshot.dice1, snapshot.dice2);
      dice.setUsedDice(snapshot.usedDice);
    }
  };

  const handleSave = async (slot: number) => {
    const success = await gameSave.save(slot, {
      boardPoints: gameState.boardPoints,
      whiteBar: gameState.whiteBar,
      blackBar: gameState.blackBar,
      whiteBorneOff: gameState.whiteBorneOff,
      blackBorneOff: gameState.blackBorneOff,
      currentPlayer: gameState.currentPlayer,
      dice1: dice.dice1,
      dice2: dice.dice2,
      usedDice: dice.usedDice,
      cubeValue: doublingCube.cubeValue,
      cubeOwner: doublingCube.cubeOwner,
      timestamp: Date.now(),
    });
    
    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Game Saved',
        text2: `Game saved to slot ${slot}`,
        position: 'top',
        visibilityTime: 2000,
      });
      setShowSaveLoadMenu(false);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Could not save game',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  const handleLoad = async (slot: number) => {
    const savedState = await gameSave.load(slot);
    if (savedState) {
      gameState.setGameState(
        savedState.boardPoints,
        savedState.whiteBar,
        savedState.blackBar,
        savedState.whiteBorneOff,
        savedState.blackBorneOff,
        savedState.currentPlayer
      );
      dice.setDiceValues(savedState.dice1, savedState.dice2);
      dice.setUsedDice(savedState.usedDice);
      doublingCube.setCubeValue(savedState.cubeValue);
      if (savedState.cubeOwner !== null) {
        doublingCube.setCubeOwner(savedState.cubeOwner);
      }
      moveHistory.clearHistory();
      setShowSaveLoadMenu(false);
      Toast.show({
        type: 'success',
        text1: 'Game Loaded',
        text2: `Game loaded from slot ${slot}`,
        position: 'top',
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Load Failed',
        text2: 'Could not load game',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  const handleDelete = async (slot: number) => {
    const success = await gameSave.remove(slot);
    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Game Deleted',
        text2: `Slot ${slot} cleared`,
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  const handleOfferDouble = () => {
    doublingCube.offerDouble(gameState.currentPlayer);
  };

  const handleAcceptDouble = () => {
    doublingCube.acceptDouble();
  };

  const handleRejectDouble = () => {
    gameState.setGameEnded(true);
    gameState.setWinner(-gameState.currentPlayer);
    doublingCube.rejectDouble();
  };

  const handleCloseWinModal = () => {
    setShowWinModal(false);
  };

  const availableDestinations = React.useMemo(
    () => moveValidation.getAvailableDestinations(
      gameState.selectedPointId,
      gameState.selectedFromBar,
      () => dice.getAvailableDice()
    ),
    [gameState.selectedPointId, gameState.selectedFromBar, dice.dice1, dice.dice2, dice.usedDice, gameState.boardPoints]
  );
  
  const isBearingOff = moveValidation.canBearingOff();
  const canBearOffFromSelected = React.useMemo(
    () => gameState.selectedPointId !== null && 
      moveValidation.getBearingOffDestinations(
        gameState.selectedPointId,
        () => dice.getAvailableDice()
      ),
    [gameState.selectedPointId, dice.dice1, dice.dice2, dice.usedDice, gameState.boardPoints]
  );
  
  const forcedMove = React.useMemo(
    () => moveValidation.getForcedMoveInfo(),
    [dice.dice1, dice.dice2, dice.usedDice, gameState.boardPoints, gameState.currentPlayer]
  );
  const bestMoveHint = React.useMemo(
    () => moveValidation.getBestMoveHint(),
    [dice.dice1, dice.dice2, dice.usedDice, gameState.boardPoints, gameState.currentPlayer]
  );
  
  useEffect(() => {
    if (forcedMove && !gameState.gameEnded) {
      Toast.show({
        type: 'info',
        text1: 'Forced Move',
        text2: `You must use the ${forcedMove.diceValue} die`,
        position: 'top',
        visibilityTime: 2000,
      });
    }
  }, [forcedMove]);

  const leftTopPoints = getLeftTopPoints(gameState.boardPoints);
  const leftBottomPoints = getLeftBottomPoints(gameState.boardPoints);
  const rightTopPoints = getRightTopPoints(gameState.boardPoints);
  const rightBottomPoints = getRightBottomPoints(gameState.boardPoints);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.leftHalf}>
          <View style={styles.topHalf}>
            <View style={styles.pointsRow}>
              {leftTopPoints.map((point, index) => (
                <Point
                  key={point.id}
                  point={point}
                  isTop={true}
                  index={index}
                  isSelected={gameState.selectedPointId === point.id}
                  isAvailable={availableDestinations.includes(point.id)}
                  isForced={forcedMove !== null && (forcedMove.from === point.id || forcedMove.to === point.id)}
                  isHint={bestMoveHint !== null && (bestMoveHint.from === point.id || bestMoveHint.to === point.id)}
                  onPress={handlePointPress}
                />
              ))}
            </View>
          </View>
          <View style={styles.bottomHalf}>
            <View style={styles.pointsRow}>
              {leftBottomPoints.map((point, index) => (
                <Point
                  key={point.id}
                  point={point}
                  isTop={false}
                  index={index}
                  isSelected={gameState.selectedPointId === point.id}
                  isAvailable={availableDestinations.includes(point.id)}
                  isForced={forcedMove !== null && (forcedMove.from === point.id || forcedMove.to === point.id)}
                  isHint={bestMoveHint !== null && (bestMoveHint.from === point.id || bestMoveHint.to === point.id)}
                  onPress={handlePointPress}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.centerColumn}>
          <Bar
            whiteBar={gameState.whiteBar}
            blackBar={gameState.blackBar}
            currentPlayer={gameState.currentPlayer}
            selectedFromBar={gameState.selectedFromBar}
            dice1={dice.dice1}
            dice2={dice.dice2}
            isRolling={dice.isRolling}
            usedDice={dice.usedDice}
            hasCrashed={gameState.hasCrashedPieces(gameState.currentPlayer)}
            gameEnded={gameState.gameEnded}
            onBarPress={handleBarPress}
            onRollDice={dice.rollDice}
            onSetDice={handleSetDice}
            onResetGame={handleResetGame}
          />
          <DoublingCube
            cubeValue={doublingCube.cubeValue}
            cubeOwner={doublingCube.cubeOwner}
            currentPlayer={gameState.currentPlayer}
            pendingDouble={doublingCube.pendingDouble}
            canDouble={doublingCube.canDouble(gameState.currentPlayer)}
            onOfferDouble={handleOfferDouble}
            onAcceptDouble={handleAcceptDouble}
            onRejectDouble={handleRejectDouble}
            gameEnded={gameState.gameEnded}
          />
        </View>

        <View style={styles.rightHalf}>
          <View style={styles.topHalf}>
            <View style={styles.pointsRow}>
              {rightTopPoints.map((point, index) => (
                <Point
                  key={point.id}
                  point={point}
                  isTop={true}
                  index={index + 6}
                  isSelected={gameState.selectedPointId === point.id}
                  isAvailable={availableDestinations.includes(point.id)}
                  isForced={forcedMove !== null && (forcedMove.from === point.id || forcedMove.to === point.id)}
                  isHint={bestMoveHint !== null && (bestMoveHint.from === point.id || bestMoveHint.to === point.id)}
                  onPress={handlePointPress}
                />
              ))}
            </View>
          </View>
          <View style={styles.bottomHalf}>
            <View style={styles.pointsRow}>
              {rightBottomPoints.map((point, index) => (
                <Point
                  key={point.id}
                  point={point}
                  isTop={false}
                  index={index + 6}
                  isSelected={gameState.selectedPointId === point.id}
                  isAvailable={availableDestinations.includes(point.id)}
                  isForced={forcedMove !== null && (forcedMove.from === point.id || forcedMove.to === point.id)}
                  isHint={bestMoveHint !== null && (bestMoveHint.from === point.id || bestMoveHint.to === point.id)}
                  onPress={handlePointPress}
                />
              ))}
            </View>
          </View>
        </View>
      </View>

      <BearingOffArea
        whiteBorneOff={gameState.whiteBorneOff}
        blackBorneOff={gameState.blackBorneOff}
        currentPlayer={gameState.currentPlayer}
        isBearingOff={canBearOffFromSelected}
        onPress={handleBearingOffPress}
      />

      <Pressable
        style={styles.infoIconButton}
        onPress={() => setShowGameInfo(true)}
      >
        <Text style={styles.infoIconText}>ℹ️</Text>
      </Pressable>

      <View style={styles.uiPanel}>
        <View style={styles.actionButtons}>
          {moveHistory.canUndo && (
            <Pressable
              style={styles.undoButton}
              onPress={handleUndo}
            >
              <Text style={styles.undoButtonText}>Undo</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.saveLoadButton}
            onPress={() => setShowSaveLoadMenu(true)}
          >
            <Text style={styles.undoButtonText}>Save/Load</Text>
          </Pressable>
          <Pressable
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.undoButtonText}>Settings</Text>
          </Pressable>
          <Pressable
            style={styles.helpButton}
            onPress={() => setShowRules(true)}
          >
            <Text style={styles.undoButtonText}>Rules</Text>
          </Pressable>
          <Pressable
            style={styles.helpButton}
            onPress={() => setShowFAQ(true)}
          >
            <Text style={styles.undoButtonText}>FAQ</Text>
          </Pressable>
        </View>
      </View>

      <GameStateDebug
        onSetGameState={gameState.setGameState}
      />

      <WinModal
        visible={showWinModal}
        statistics={gameState.getGameStatistics()}
        score={gameState.getGameScore()}
        onClose={handleCloseWinModal}
        onNewGame={handleResetGame}
      />

      <SaveLoadMenu
        visible={showSaveLoadMenu}
        savedGames={gameSave.savedGames}
        loading={gameSave.loading}
        onSave={handleSave}
        onLoad={handleLoad}
        onDelete={handleDelete}
        onClose={() => setShowSaveLoadMenu(false)}
      />

      <GameInfoModal
        visible={showGameInfo}
        onClose={() => setShowGameInfo(false)}
        currentPlayer={gameState.currentPlayer}
        cubeValue={doublingCube.cubeValue}
        cubeOwner={doublingCube.cubeOwner}
        player1Name={settings.settings?.player1Name}
        player2Name={settings.settings?.player2Name}
        moveCount={gameState.getGameStatistics().moves}
        turnNumber={turnNumber}
        elapsedTime={gameTimer.elapsedTime}
        moveTime={gameTimer.moveTime}
        formatTime={gameTimer.formatTime}
        moves={moveHistory.getHistory()}
      />

      <SettingsScreen
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <RulesScreen
        visible={showRules}
        onClose={() => setShowRules(false)}
      />

      <FAQScreen
        visible={showFAQ}
        onClose={() => setShowFAQ(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    backgroundColor: '#808080',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  container: {
    aspectRatio: 2,
    flex: 1,
    maxHeight: '100%',
    backgroundColor: '#D2B48C',
    padding: 6,
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: '#8B4513',
    alignSelf: 'center',
  },
  leftHalf: {
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
  },
  rightHalf: {
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
  },
  topHalf: {
    height: '50%',
    minHeight: 0,
  },
  bottomHalf: {
    height: '50%',
    minHeight: 0,
  },
  pointsRow: {
    flexDirection: 'row',
    height: '100%',
    gap: 0,
  },
  centerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#654321',
    zIndex: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoIconText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  uiPanel: {
    position: 'absolute',
    top: 60,
    right: 10,
    gap: 8,
    zIndex: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  undoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#8B4513',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#654321',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveLoadButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2196F3',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF9800',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#F57C00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  undoButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BackgammonBoard;
