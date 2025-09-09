import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
import MinigameWrapper from '@/components/minigames/MinigameWrapper';
import TetrisGame from '@/game/tetris/TetrisGame';
import PoopDodgeGame from '@/game/poop/PoopDodgeGame';
import SnakeGame from '@/game/snake/SnakeGame';
import useUserStore from '@zustand/useUserStore';

export default function GameScreen({ navigation }: any) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const userId = useUserStore((state) => state.userId);

  const closeGame = () => {
    setSelectedGame(null);
  };

  return (
    <ImageBackground
      source={require('@assets/images/Main.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← 뒤로</Text>
      </TouchableOpacity>

      {/* 게임 선택 화면 */}
      <View style={styles.gameSelection}>
        <Text style={styles.title}>미니게임</Text>
        
        <View style={styles.gameGrid}>
          <TouchableOpacity
            style={styles.gameButton}
            onPress={() => setSelectedGame('tetris')}
          >
            <Text style={styles.gameButtonText}>🧱</Text>
            <Text style={styles.gameButtonLabel}>테트리스</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gameButton}
            onPress={() => setSelectedGame('poop')}
          >
            <Text style={styles.gameButtonText}>💩</Text>
            <Text style={styles.gameButtonLabel}>똥 피하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gameButton}
            onPress={() => setSelectedGame('snake')}
          >
            <Text style={styles.gameButtonText}>🐍</Text>
            <Text style={styles.gameButtonLabel}>스네이크</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 테트리스 게임 */}
      <MinigameWrapper
        userId={userId || ''}
        gameName="tetris"
        goldPerPoint={1}
        visible={selectedGame === 'tetris'}
        onClose={closeGame}
      >
        {(props) => <TetrisGame {...props} />}
      </MinigameWrapper>

      {/* 똥 피하기 게임 */}
      <MinigameWrapper
        userId={userId || ''}
        gameName="poop_dodge"
        goldPerPoint={2}
        visible={selectedGame === 'poop'}
        onClose={closeGame}
      >
        {(props) => <PoopDodgeGame {...props} />}
      </MinigameWrapper>

      {/* 스네이크 게임 */}
      <MinigameWrapper
        userId={userId || ''}
        gameName="snake"
        goldPerPoint={1}
        visible={selectedGame === 'snake'}
        onClose={closeGame}
      >
        {(props) => <SnakeGame {...props} />}
      </MinigameWrapper>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(203, 167, 78, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameSelection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 36,
    color: '#CBA74E',
    fontWeight: 'bold',
    marginBottom: 60,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 30,
  },
  gameButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gameButtonText: {
    fontSize: 40,
    marginBottom: 8,
  },
  gameButtonLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});