import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { MinigameProps } from '@/components/minigames/MinigameWrapper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 게임 설정
const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 21;
const CELL_SIZE = Math.min(SCREEN_WIDTH * 0.95 / BOARD_WIDTH, (SCREEN_HEIGHT * 0.7) / BOARD_HEIGHT);

interface Position {
  x: number;
  y: number;
  imageIndex: number; // 오리 이미지 인덱스
  id: string; // 고유 ID
}

// 오리 이미지 배열
const DUCK_IMAGES = [
  require('@assets/images/duck_image1.png'),
  require('@assets/images/duck_image2.png'),
  require('@assets/images/duck_image3.png'),
  require('@assets/images/duck_image4.png'),
  require('@assets/images/duck_image5.png'),
  require('@assets/images/duck_image6.png'),
];

enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export default function SnakeGame({ onGameEnd, onScoreUpdate }: MinigameProps) {
  const [snake, setSnake] = useState<Position[]>([
    { x: 7, y: 10, imageIndex: 0, id: 'segment-0' }
  ]);
  const segmentIdCounter = useRef(1);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef(direction);

  // 방향 업데이트
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // 랜덤 음식 위치 생성
  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: { x: number; y: number };
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * BOARD_HEIGHT),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    const initialSnake = [
      { x: 7, y: 10, imageIndex: 0, id: 'segment-0' }
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection(Direction.RIGHT);
    setScore(0);
    setGameRunning(true);
    setGameStarted(true);
    segmentIdCounter.current = 1;
  }, [generateFood]);

  // 게임 루프
  useEffect(() => {
    if (!gameRunning || !gameStarted) return;

    const gameLoop = () => {
      setSnake(currentSnake => {
        // 새로운 머리 위치 계산 (기존 머리와 같은 이미지 유지)
        const newHead = { 
          x: currentSnake[0].x, 
          y: currentSnake[0].y,
          imageIndex: currentSnake[0].imageIndex,
          id: `segment-${segmentIdCounter.current++}`
        };

        // 방향에 따라 머리 이동
        switch (directionRef.current) {
          case Direction.UP:
            newHead.y -= 1;
            break;
          case Direction.DOWN:
            newHead.y += 1;
            break;
          case Direction.LEFT:
            newHead.x -= 1;
            break;
          case Direction.RIGHT:
            newHead.x += 1;
            break;
        }

        // 벽 충돌 체크
        if (newHead.x < 0 || newHead.x >= BOARD_WIDTH || newHead.y < 0 || newHead.y >= BOARD_HEIGHT) {
          setGameRunning(false);
          return currentSnake;
        }

        // 자기 자신과 충돌 체크
        if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameRunning(false);
          return currentSnake;
        }

        // 음식 먹기 체크
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          // 비동기로 onScoreUpdate 호출
          setTimeout(() => onScoreUpdate(newScore), 0);
          
          // 먹이를 먹었을 때: 뱀이 길어짐
          // 새로운 머리에 랜덤 이미지 설정
          newHead.imageIndex = Math.floor(Math.random() * 6);
          // 새로운 머리 추가하고 꼬리는 제거하지 않음 (길이 증가)
          const newSnake = [newHead, ...currentSnake];
          
          setFood(generateFood(newSnake));
          return newSnake;
        } else {
          // 먹이를 먹지 않았을 때: 길이 유지
          const newSnake = [...currentSnake];
          newSnake.unshift(newHead); // 새 머리 추가
          newSnake.pop(); // 꼬리 제거
          return newSnake;
        }
      });
    };

    gameLoopRef.current = setInterval(gameLoop, 200) as unknown as number;

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameRunning, gameStarted, food, score, onScoreUpdate, generateFood]);

  // 게임 종료 처리
  useEffect(() => {
    if (!gameRunning && gameStarted) {
      // 비동기로 onGameEnd 호출
      setTimeout(() => onGameEnd(score), 0);
    }
  }, [gameRunning, gameStarted, score, onGameEnd]);

  // 게임 종료 시 타이머 정리
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <View style={styles.startScreen}>
          <Text style={styles.title}>🐍 Snake Game</Text>
          <Text style={styles.instructions}>버튼으로 방향을 바꿔서</Text>
          <Text style={styles.instructions}>하트를 먹어보세요!</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>게임 시작</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.gameHeader}>
            <Text style={styles.scoreText}>점수: {score}</Text>
          </View>

          <View style={styles.gameBoard}>
            {/* 게임 보드 */}
            <View style={[styles.board, { 
              width: BOARD_WIDTH * CELL_SIZE, 
              height: BOARD_HEIGHT * CELL_SIZE 
            }]}>
              {/* 뱀 렌더링 */}
              {snake.map((segment, index) => (
                <View
                  key={segment.id}
                  style={[
                    styles.snakeSegment,
                    {
                      left: segment.x * CELL_SIZE,
                      top: segment.y * CELL_SIZE,
                      width: CELL_SIZE - 1,
                      height: CELL_SIZE - 1,
                    },
                  ]}
                >
                  <Image
                    source={DUCK_IMAGES[segment.imageIndex]}
                    style={styles.duckImage}
                    resizeMode="contain"
                  />
                </View>
              ))}

              {/* 음식 렌더링 */}
              <View
                style={[
                  styles.food,
                  {
                    left: food.x * CELL_SIZE,
                    top: food.y * CELL_SIZE,
                    width: CELL_SIZE - 1,
                    height: CELL_SIZE - 1,
                  },
                ]}
              >
                <Image
                  source={require('@assets/icons/heart.png')}
                  style={styles.heartImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {/* 방향 버튼들 */}
          <View style={styles.controlsContainer}>
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => directionRef.current !== Direction.DOWN && setDirection(Direction.UP)}
              >
                <Text style={styles.controlButtonText}>↑</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.controlsRowWide}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => directionRef.current !== Direction.RIGHT && setDirection(Direction.LEFT)}
              >
                <Text style={styles.controlButtonText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => directionRef.current !== Direction.LEFT && setDirection(Direction.RIGHT)}
              >
                <Text style={styles.controlButtonText}>→</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => directionRef.current !== Direction.UP && setDirection(Direction.DOWN)}
              >
                <Text style={styles.controlButtonText}>↓</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#00ff00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
  },
  startButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameHeader: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  gameBoard: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  board: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
  },
  snakeSegment: {
    position: 'absolute',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duckImage: {
    width: '100%',
    height: '100%',
  },
  food: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartImage: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    paddingVertical: 10,
    paddingBottom: 40,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  controlsRowWide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    width: 210,
    alignSelf: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});