import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type GameObject = { id: string; x: number; y: number; sx: number; sy: number; move: number; image: any; };
const createPlayer = (): GameObject => ({ id: 'player', x: SCREEN_WIDTH / 2 - 25, y: SCREEN_HEIGHT - 120, sx: 50, sy: 80, move: 10, image: require('../../assets/images/shiba_image6.png') });
const createAlien = (difficulty: number): GameObject => ({ id: Math.random().toString(), x: Math.random() * (SCREEN_WIDTH - 40), y: 0, sx: 40, sy: 40, move: 3 + difficulty * 0.5, image: require('../../assets/icons/poop.png') });

export default function GameScreen({ navigation }: any) {
  const [player, setPlayer] = useState<GameObject>(createPlayer());
  const playerRef = useRef<GameObject>(player);
  const [aliens, setAliens] = useState<GameObject[]>([]);
  const [dodgedCount, setDodgedCount] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const PLAYER_SCALE = 1.5;

  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    const p = createPlayer();
    setPlayer(p);
    playerRef.current = p;
    setAliens([]);
    setDodgedCount(0);
    setTime(0);
    setIsGameOver(false);
    setRunning(true);
    setShowStartScreen(false);
  };

  // 게임 루프
  useEffect(() => {
    if (!running) return;
    const gameLoop = setInterval(() => {
      const difficulty = Math.floor(time / 10);
      const spawnRate = 0.98 - difficulty * 0.005;

      setAliens(prevAliens => {
        let currentAliens = prevAliens.map(a => ({ ...a, y: a.y + a.move }));
        const survivedAliens = currentAliens.filter(a => a.y < SCREEN_HEIGHT);
        setDodgedCount(prev => prev + (currentAliens.length - survivedAliens.length));

        for (const alien of survivedAliens) {
          const p = playerRef.current;
          if (p.x < alien.x + alien.sx && p.x + p.sx > alien.x && p.y < alien.y + alien.sy && p.y + p.sy > alien.y) {
            setRunning(false);
            setIsGameOver(true);
            return [];
          }
        }
        return survivedAliens;
      });

      if (Math.random() > spawnRate) setAliens(prev => [...prev, createAlien(difficulty)]);
    }, 1000 / 60);
    return () => clearInterval(gameLoop);
  }, [running, time]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime(v => v + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const handleMove = (direction: 'left' | 'right') => {
    setPlayer(p => {
      const newX = direction === 'left' ? p.x - p.move : p.x + p.move;
      const clampedX = Math.min(Math.max(0, newX), SCREEN_WIDTH - p.sx);
      const updated = { ...p, x: clampedX };
      playerRef.current = updated;
      return updated;
    });
  };

  const handlePressIn = (direction: 'left' | 'right') => {
    if (!running) return;
    handleMove(direction);
    moveIntervalRef.current = setInterval(() => handleMove(direction), 50);
  };

  const handlePressOut = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  if (isGameOver) return (
    <View style={styles.gameOver}>
      <Text style={styles.gameOverText}>GAME OVER</Text>
      <Text style={styles.stats}>최종 시간: {time}초</Text>
      <Text style={styles.stats}>피한 똥 수: {dodgedCount}</Text>
      <TouchableOpacity style={styles.startButton} onPress={startGame}><Text style={styles.startButtonText}>재시작</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 오른쪽 상단 나가기 버튼 */}
      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <Text style={styles.exitText}>나가기</Text>
      </TouchableOpacity>

      {showStartScreen ? (
        <View style={styles.startScreen}>
          <Text style={styles.startText}>PRESS START TO PLAY</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>게임 시작</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.hudLeft}>피한 똥: {dodgedCount}</Text>
          <Text style={styles.hudRight}>시간: {time}</Text>

          <Image
            source={player.image}
            style={[styles.player, { left: player.x, top: player.y, width: player.sx * PLAYER_SCALE, height: undefined, aspectRatio: player.sx / player.sy }]}
            resizeMode="contain"
          />
          {aliens.map(a => <Image key={a.id} source={a.image} style={{ position: 'absolute', left: a.x, top: a.y, width: a.sx, height: a.sy }} />)}
          {/* 좌우 버튼 */}
            <TouchableOpacity
              style={[styles.controlButton, styles.leftButton]}
              onPressIn={() => handlePressIn('left')}
              onPressOut={handlePressOut}
            >
              <Text style={styles.controlText}>◀</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.rightButton]}
              onPressIn={() => handlePressIn('right')}
              onPressOut={handlePressOut}
            >
              <Text style={styles.controlText}>▶</Text>
            </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  exitButton: { position: 'absolute', top: 40, right: 20, zIndex: 10, backgroundColor: 'red', padding: 10, borderRadius: 10 },
  exitText: { color: 'white', fontWeight: 'bold' },
  startScreen: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  startText: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  startButton: { backgroundColor: '#22c55e', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  startButtonText: { color: 'white', fontWeight: 'bold' },
  hudLeft: { position: 'absolute', top: 20, left: 10, color: 'yellow', fontWeight: 'bold' },
  hudRight: { position: 'absolute', top: 20, right: 10, color: 'yellow', fontWeight: 'bold' },
  player: { position: 'absolute' },
  controls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around' },
  gameOver: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  gameOverText: { fontSize: 36, color: 'red', fontWeight: 'bold', marginBottom: 20 },
  stats: { fontSize: 20, color: 'white', marginBottom: 10 },
  controlButton: {
    backgroundColor: '#1f2937',
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
  },
  leftButton: { left: 10 },
  rightButton: { right: 10 },
  controlText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
