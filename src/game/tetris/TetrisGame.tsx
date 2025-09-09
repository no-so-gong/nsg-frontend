import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { MinigameProps } from '@/components/minigames/MinigameWrapper';
import usePetStore from '@zustand/usePetStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 테트리스 설정
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 19;
const CELL_SIZE = (SCREEN_WIDTH * 0.8) / BOARD_WIDTH;

// 테트리스 블록 모양
const TETROMINOES = {
  I: [
    [1, 1, 1, 1]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1]
  ]
};

const COLORS = {
  I: '#00f5ff',
  O: '#ffff00',
  T: '#800080',
  S: '#00ff00',
  Z: '#ff0000',
  J: '#0000ff',
  L: '#ff8c00',
  empty: 'transparent',
  ghost: 'rgba(255,255,255,0.3)'
};

type TetrominoType = keyof typeof TETROMINOES;
type Board = (TetrominoType | null)[][];

interface Piece {
  shape: number[][];
  type: TetrominoType;
  x: number;
  y: number;
}

export default function TetrisGame({ onGameEnd, onScoreUpdate }: MinigameProps) {
  const currentPetImage = usePetStore(state => state.currentPetImage);
  const [board, setBoard] = useState<Board>(() => 
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPieces, setNextPieces] = useState<Piece[]>([]);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSoftDropping, setIsSoftDropping] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const dropSpeedRef = useRef(1000);
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 새로운 블록 생성
  const createPiece = useCallback((): Piece => {
    const types = Object.keys(TETROMINOES) as TetrominoType[];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      shape: TETROMINOES[type],
      type,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[type][0].length / 2),
      y: 0
    };
  }, []);

  // 다음 블록들 초기화
  const initializeNextPieces = useCallback(() => {
    const pieces = [];
    for (let i = 0; i < 2; i++) {
      pieces.push(createPiece());
    }
    return pieces;
  }, [createPiece]);

  // 다음 블록 가져오기
  const getNextPiece = useCallback(() => {
    if (nextPieces.length === 0) return createPiece();
    
    const nextPiece = nextPieces[0];
    const remainingPieces = nextPieces.slice(1);
    remainingPieces.push(createPiece());
    setNextPieces(remainingPieces);
    
    return nextPiece;
  }, [nextPieces, createPiece]);

  // 블록 회전
  const rotatePiece = (piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    return { ...piece, shape: rotated };
  };

  // 충돌 검사
  const isValidPosition = (piece: Piece, board: Board, dx = 0, dy = 0): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // 블록을 보드에 고정
  const placePiece = (piece: Piece, board: Board): Board => {
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && 
              boardX >= 0 && boardX < BOARD_WIDTH && 
              newBoard[boardY]) {
            newBoard[boardY][boardX] = piece.type;
          }
        }
      }
    }
    return newBoard;
  };

  // 라인 제거
  const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === null));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
    }
    
    return { newBoard, linesCleared };
  };

  // 게임 시작
  const startGame = () => {
    const newBoard = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
    const initialNextPieces = initializeNextPieces();
    setBoard(newBoard);
    setNextPieces(initialNextPieces);
    setCurrentPiece(createPiece());
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPlaying(true);
    dropSpeedRef.current = 700;
  };

  // 블록 드롭
  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver) return;

    if (isValidPosition(currentPiece, board, 0, 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
    } else {
      // 블록 고정
      const newBoard = placePiece(currentPiece, board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      
      if (linesCleared > 0) {
        const points = linesCleared * 50;
        setScore(prev => prev + points);
        
        // 레벨 업
        const newLevel = Math.floor((lines + linesCleared) / 10) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          dropSpeedRef.current = Math.max(80, 700 - (newLevel - 1) * 80);
        }
      }

      // 새 블록 생성
      const newPiece = getNextPiece();
      if (isValidPosition(newPiece, clearedBoard)) {
        setCurrentPiece(newPiece);
      } else {
        // 게임 오버
        setGameOver(true);
        setIsPlaying(false);
        onGameEnd(Math.floor(score / 2));
      }
    }
  }, [currentPiece, board, gameOver, score, level, lines, getNextPiece, onGameEnd]);

  // 게임 루프
  useEffect(() => {
    if (isPlaying && !gameOver) {
      const speed = isSoftDropping ? Math.max(50, dropSpeedRef.current / 10) : dropSpeedRef.current;
      gameLoopRef.current = setInterval(dropPiece, speed);
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [isPlaying, gameOver, dropPiece, currentPiece, isSoftDropping]);

  // 점수 업데이트
  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  // 조작
  const movePiece = (dx: number) => {
    if (!currentPiece || !isPlaying) return;
    if (isValidPosition(currentPiece, board, dx, 0)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + dx } : null);
    }
  };

  const rotatePieceHandler = () => {
    if (!currentPiece || !isPlaying) return;
    const rotated = rotatePiece(currentPiece);
    if (isValidPosition(rotated, board)) {
      setCurrentPiece(rotated);
    }
  };

  const hardDrop = () => {
    if (!currentPiece || !isPlaying) return;
    let newY = currentPiece.y;
    while (isValidPosition(currentPiece, board, 0, newY - currentPiece.y + 1)) {
      newY++;
    }
    const droppedPiece = { ...currentPiece, y: newY };
    
    // 블록을 보드에 즉시 고정
    const newBoard = placePiece(droppedPiece, board);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    
    setBoard(clearedBoard);
    setLines(prev => prev + linesCleared);
    
    if (linesCleared > 0) {
      const points = linesCleared * 50;
      setScore(prev => prev + points);
      
      // 레벨 업
      const newLevel = Math.floor((lines + linesCleared) / 10) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        dropSpeedRef.current = Math.max(80, 700 - (newLevel - 1) * 80);
      }
    }

    // 새 블록 생성
    const newPiece = getNextPiece();
    if (isValidPosition(newPiece, clearedBoard)) {
      setCurrentPiece(newPiece);
    } else {
      // 게임 오버
      setGameOver(true);
      setIsPlaying(false);
      onGameEnd(score);
    }
  };

  const handleSingleMove = (direction: 'left' | 'right') => {
    if (!isPlaying) return;
    movePiece(direction === 'left' ? -1 : 1);
  };

  const handlePressIn = (direction: 'left' | 'right') => {
    if (!isPlaying) return;
    movePiece(direction === 'left' ? -1 : 1);
    moveIntervalRef.current = setInterval(() => {
      movePiece(direction === 'left' ? -1 : 1);
    }, 150);
  };

  const handlePressOut = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  const handleSoftDropStart = () => {
    if (!isPlaying) return;
    setIsSoftDropping(true);
  };

  const handleSoftDropEnd = () => {
    setIsSoftDropping(false);
  };

  // 보드와 현재 블록을 합친 렌더링용 보드
  const getRenderBoard = (): (TetrominoType | null)[][] => {
    const renderBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && 
                boardX >= 0 && boardX < BOARD_WIDTH && 
                renderBoard[boardY]) {
              renderBoard[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
    }
    
    return renderBoard;
  };

  // 다음 블록 미리보기 렌더링
  const renderNextPiece = (piece: Piece, index: number) => {
    const maxSize = Math.max(piece.shape.length, piece.shape[0]?.length || 0);
    const cellSize = CELL_SIZE / 3;
    
    return (
      <View key={index} style={styles.nextPieceContainer}>
        <Text style={styles.nextLabel}>{index === 0 ? 'NEXT' : 'AFTER'}</Text>
        <View style={[styles.nextPieceBoard, { width: maxSize * cellSize, height: maxSize * cellSize }]}>
          {Array.from({ length: maxSize }, (_, y) => (
            <View key={y} style={styles.nextRow}>
              {Array.from({ length: maxSize }, (_, x) => {
                const hasBlock = y < piece.shape.length && 
                                 x < piece.shape[y].length && 
                                 piece.shape[y][x];
                return (
                  <View
                    key={x}
                    style={[
                      styles.nextCell,
                      {
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: hasBlock ? COLORS[piece.type] : 'transparent'
                      }
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!isPlaying ? (
        <View style={styles.startScreen}>
          <Text style={styles.title}>TETRIS</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.gameContainer}>
            {/* 메인 게임 영역 */}
            <View style={styles.mainGame}>
              {/* 게임 정보 */}
              <View style={styles.gameInfo}>
                <Text style={styles.infoText}>Score: {score}</Text>
                <Text style={styles.infoText}>Lines: {lines}</Text>
                <Text style={styles.infoText}>Level: {level}</Text>
              </View>

              {/* 게임 보드 */}
              <View style={styles.gameBoard}>
            {getRenderBoard().map((row, y) => (
              <View key={y} style={styles.row}>
                {row.map((cell, x) => (
                  <View
                    key={x}
                    style={[
                      styles.cell,
                      { backgroundColor: cell ? COLORS[cell] : COLORS.empty }
                    ]}
                  />
                ))}
              </View>
            ))}
              </View>
            </View>

            {/* 다음 블록 미리보기 */}
            <View style={styles.sidePanel}>
              {nextPieces.length > 0 && renderNextPiece(nextPieces[0], 0)}
              
              {/* 펫 이미지 */}
              <View style={styles.chickImageContainer}>
                <Image
                  source={currentPetImage || require('@assets/images/chick_image3.png')}
                  style={styles.chickImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {/* 조작 버튼 */}
          <View style={styles.controls}>
            <View style={styles.mainControls}>
              <TouchableOpacity 
                style={styles.controlButton} 
                onPressIn={() => handlePressIn('left')}
                onPressOut={handlePressOut}
              >
                <Text style={styles.controlText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={rotatePieceHandler}>
                <Text style={styles.controlText}>↻</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.controlButton} 
                onPressIn={handleSoftDropStart}
                onPressOut={handleSoftDropEnd}
              >
                <Text style={styles.controlText}>↓</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.controlButton} 
                onPressIn={() => handlePressIn('right')}
                onPressOut={handlePressOut}
              >
                <Text style={styles.controlText}>→</Text>
              </TouchableOpacity>
            </View>
            {/* 하드 드롭 버튼 */}
            <TouchableOpacity style={styles.hardDropButton} onPress={hardDrop}>
              <Text style={styles.hardDropText}>⬇</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    paddingTop: 40,
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: -10,
    marginTop: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameBoard: {
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  controls: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  mainControls: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  sidePanel: {
    width: 80,
    alignItems: 'center',
    position: 'absolute',
    top: 52,
    right: -15,
  },
  mainGame: {
    alignItems: 'center',
  },
  nextPieceContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  chickImageContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  chickImage: {
    width: 60,
    height: 60,
  },
  nextLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  nextPieceBoard: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  nextRow: {
    flexDirection: 'row',
  },
  nextCell: {
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  hardDropButton: {
    backgroundColor: '#ef4444',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hardDropText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});