import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
import { startMinigame, submitMinigameResult } from '@/apis/minigames';
import useMoneyStore from '@zustand/useMoneyStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MinigameProps {
  userId: string;
  onGameEnd: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface MinigameWrapperProps {
  userId: string;
  gameId: number; // 1, 2, 3 중 하나
  gameName: string;
  goldPerPoint?: number;
  children: (props: MinigameProps) => React.ReactNode;
  visible: boolean;
  onClose: () => void;
}

export default function MinigameWrapper({
  userId,
  gameId,
  gameName,
  goldPerPoint = 1,
  children,
  visible,
  onClose,
}: MinigameWrapperProps) {
  const [currentScore, setCurrentScore] = useState(0);
  const [totalGoldEarned, setTotalGoldEarned] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [showGoldAnimation, setShowGoldAnimation] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<string | null>(null);
  const [canPlay, setCanPlay] = useState(true);
  const [remainingPlays, setRemainingPlays] = useState<number | null>(null);
  const [isCheckingPlayability, setIsCheckingPlayability] = useState(false);

  const addMoney = useMoneyStore(state => state.addMoney);
  const goldAnimationValue = useRef(new Animated.Value(0)).current;
  const goldScaleValue = useRef(new Animated.Value(0)).current;

  // 게임이 보여질 때 시작 시간 기록 (GameScreen에서 이미 체크 완료)
  useEffect(() => {
    if (visible && !gameEnded) {
      setGameStartTime(new Date().toISOString());
    }
  }, [visible, gameEnded]);

  const handleGameEnd = async (score: number) => {
    const goldEarned = score * goldPerPoint;
    const endTime = new Date().toISOString();

    setCurrentScore(score);
    setTotalGoldEarned(goldEarned);
    setGameEnded(true); // 바로 결과 화면으로 전환

    // 시작 시간이 없으면 현재 시간으로 설정 (fallback)
    const startTime = gameStartTime || endTime;

    // 플레이 시간 계산 (초 단위)
    const timeSpent = Math.floor(
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
    );

    try {
      // 미니게임 결과 제출 API 호출 (재화 지급 포함)
      const response = await submitMinigameResult(
        gameId,
        {
          score: score,
          money: goldEarned,
          timeSpent: timeSpent,
          startedAt: startTime,
          completedAt: endTime,
        },
        userId
      );

      console.log(`${gameName} 게임 종료 - 점수: ${score}, 골드: ${goldEarned} 지급 완료`);
      console.log('API 응답:', response);

      // Zustand store 업데이트 (navbar 반영)
      if (goldEarned > 0) {
        addMoney(goldEarned);
        // 결과 화면에서 골드 획득 애니메이션 시작
        startGoldAnimation();
      }
    } catch (error) {
      console.error('미니게임 결과 제출 실패:', error);
      Alert.alert('알림', '미니게임 결과 제출 중 오류가 발생했습니다.');
    }
  };

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score);
  };

  const startGoldAnimation = () => {
    setShowGoldAnimation(true);

    // 애니메이션 초기화
    goldAnimationValue.setValue(0);
    goldScaleValue.setValue(0);

    // 동시 애니메이션 시작
    Animated.parallel([
      Animated.sequence([
        Animated.timing(goldScaleValue, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(goldScaleValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(goldAnimationValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션 완료 후 2초 뒤에 숨김
      setTimeout(() => {
        setShowGoldAnimation(false);
      }, 2000);
    });
  };

  const handleClose = () => {
    setGameEnded(false);
    setCurrentScore(0);
    setTotalGoldEarned(0);
    setGameStartTime(null);
    setCanPlay(true);
    setRemainingPlays(null);
    onClose();
  };

  const handleRestart = async () => {
    setGameEnded(false);
    setCurrentScore(0);
    setTotalGoldEarned(0);
    setShowGoldAnimation(false); // 골드 애니메이션 숨김

    // 재시작 시 플레이 가능 여부 다시 확인
    try {
      const response = await startMinigame(gameId, userId);
      setCanPlay(response.data.canPlay);
      setRemainingPlays(response.data.remainingPlays);
      setGameStartTime(new Date().toISOString());

      if (!response.data.canPlay) {
        Alert.alert('알림', '오늘의 플레이 횟수를 모두 사용했습니다.\n(하루 횟수: 게임당 3회)');
        handleClose();
      }
    } catch (error) {
      console.error('미니게임 재시작 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '게임을 재시작할 수 없습니다.';
      Alert.alert('알림', `${errorMessage}\n(하루 횟수: 게임당 3회)`);
      handleClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* 게임 종료 결과 화면 */}
        {gameEnded ? (
          <View style={styles.resultContainer}>
            <Text style={styles.gameOverText}>게임 종료!</Text>
            <Text style={styles.scoreText}>점수: {currentScore}</Text>
            <Text style={styles.goldText}>획득 골드: {totalGoldEarned}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                <Text style={styles.buttonText}>다시 하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exitButton} onPress={handleClose}>
                <Text style={styles.buttonText}>나가기</Text>
              </TouchableOpacity>
            </View>

            {/* 골드 획득 애니메이션 (결과 화면 위에 표시) */}
            {showGoldAnimation && (
              <Animated.View
                style={[
                  styles.goldAnimationContainer,
                  {
                    opacity: goldAnimationValue,
                    transform: [
                      { scale: goldScaleValue },
                      {
                        translateY: goldAnimationValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, -20],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.goldAnimationText}>+{totalGoldEarned} 골드!</Text>
              </Animated.View>
            )}
          </View>
        ) : (
          <>
            {/* 게임 UI */}
            {children({
              userId,
              onGameEnd: handleGameEnd,
              onScoreUpdate: handleScoreUpdate,
            })}

            {/* 상단 UI - 나가기 버튼 */}
            <View style={styles.topUI}>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topUI: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255,0,0,0.8)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 40,
  },
  gameOverText: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 24,
    color: 'yellow',
    marginBottom: 15,
  },
  goldText: {
    fontSize: 24,
    color: 'gold',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  restartButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  exitButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goldAnimationContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  goldAnimationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
});