import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
import MinigameWrapper from '@/components/minigames/MinigameWrapper';
import TetrisGame from '@/game/tetris/TetrisGame';
import PoopDodgeGame from '@/game/poop/PoopDodgeGame';
import SnakeGame from '@/game/snake/SnakeGame';
import useUserStore from '@zustand/useUserStore';
import CommonButton from '@/components/CommonButton';
import BoneLabelSvg from '@/components/BoneLabelSvg';

interface GameScreenProps {
  visible: boolean;
  onClose: () => void; 
}

export default function GameScreen({ visible, onClose }: GameScreenProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const userId = useUserStore((state) => state.userId);

  const closeGame = () => {
    setSelectedGame(null);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.boneWrapper}>
              <BoneLabelSvg label="게임" />
            </View>
            {/* 게임 선택 화면 */}
            {!selectedGame && (
              <View style={styles.gameSelection}>
                <View style={styles.gameGrid}>
                  {/* 테트리스 */}
                  <TouchableOpacity onPress={() => setSelectedGame('tetris')}>
                    <ImageBackground
                      source={require('../../assets/images/tetrisbk.png')}
                      style={styles.gameButton}
                      imageStyle={{ borderRadius: 15}}
                    >
                    </ImageBackground>
                  </TouchableOpacity>
                  {/* 응아! */}
                  <TouchableOpacity onPress={() => setSelectedGame('poop')}>
                    <ImageBackground
                      source={require('../../assets/images/ddongbk.png')}
                      style={styles.gameButton}
                      imageStyle={{ borderRadius: 15 }}
                    >
                    </ImageBackground>
                  </TouchableOpacity>
                  {/* 뱀 */}
                  <TouchableOpacity onPress={() => setSelectedGame('snake')}>
                    <ImageBackground
                      source={require('../../assets/images/snakebk.png')}
                      style={styles.gameButton}
                      imageStyle={{ borderRadius: 15 }}
                    >
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* MinigameWrapper */}
            <MinigameWrapper
              userId={userId || ''}
              gameName="tetris"
              goldPerPoint={1}
              visible={selectedGame === 'tetris'}
              onClose={closeGame}
            >
              {(props) => <TetrisGame {...props} />}
            </MinigameWrapper>

            <MinigameWrapper
              userId={userId || ''}
              gameName="poop_dodge"
              goldPerPoint={2}
              visible={selectedGame === 'poop'}
              onClose={closeGame}
            >
              {(props) => <PoopDodgeGame {...props} />}
            </MinigameWrapper>

            <MinigameWrapper
              userId={userId || ''}
              gameName="snake"
              goldPerPoint={1}
              visible={selectedGame === 'snake'}
              onClose={closeGame}
            >
              {(props) => <SnakeGame {...props} />}
            </MinigameWrapper>

            {/* 닫기 버튼 */}
            <View style={styles.buttonRow}>
              <CommonButton label="닫기" onPress={onClose} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: '#CBA74E',
    borderRadius: SCREEN_WIDTH * 0.08,
    padding: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.88,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  innerContainer: {
    backgroundColor: '#FFDD82',
    borderRadius: SCREEN_WIDTH * 0.05,
    padding: SCREEN_WIDTH * 0.04,
    width: '100%',
    alignItems: 'center',
  },
  boneWrapper: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.038,
    left: SCREEN_WIDTH * 0.29,
    zIndex: 10,
  },

  gameSelection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    
  },
  gameGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 5,
  },
  gameButton: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: 'rgba(203,167,78,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameButtonText: { fontSize: 40 },
  gameButtonLabel: { fontSize: 14, marginTop: 5, color: '#fff' },
  buttonRow: { marginTop: 0 },
  boardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});
