import React, { useState } from 'react';
import { View, Modal, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import BoneLabelSvg from './BoneLabelSvg';
import CommonButton from './CommonButton';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
import packageJson from '../../package.json';
import { resetGame } from '@/apis/endings';
import useUserStore from '@zustand/useUserStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { userId } = useUserStore();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    Alert.alert(
      '초기화 확인',
      '정말로 게임을 초기화하시겠습니까? 모든 데이터가 삭제됩니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '초기화',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);

            try {
              // 1. 백엔드 초기화 API 호출 (userId가 있을 때만)
              if (userId) {
                try {
                  await resetGame(userId);
                } catch (error) {
                  console.warn('백엔드 초기화 실패 (계속 진행):', error);
                }
              }

              // 2. AsyncStorage 초기화 (항상 실행)
              await AsyncStorage.clear();

              // 3. 앱 재시작
              Alert.alert(
                '초기화 완료',
                '게임이 초기화되었습니다. 앱을 다시 시작해주세요.',
                [
                  {
                    text: '확인',
                    onPress: async () => {
                      try {
                        // 프로덕션 빌드에서만 작동
                        if (!__DEV__) {
                          await Updates.reloadAsync();
                        } else {
                          // 개발 모드에서는 수동 재시작 안내
                          onClose();
                        }
                      } catch (e) {
                        console.error('앱 재시작 실패:', e);
                        onClose();
                      }
                    },
                  },
                ]
              );
            } catch (error: any) {
              console.error('초기화 실패:', error);
              Alert.alert('초기화 실패', error.message || '게임 초기화 중 오류가 발생했습니다.');
            } finally {
              setIsResetting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.boneWrapper}>
              <BoneLabelSvg label="설정" />
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>버전</Text>
                <Text style={styles.infoValue}>{packageJson.version}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>개발팀</Text>
                <Text style={styles.infoValue}>no-so-gong</Text>
              </View>

              <View style={styles.divider} />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>초기화</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#CBA74E',
    borderRadius: SCREEN_WIDTH * 0.08,
    padding: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.88,
    marginHorizontal: SCREEN_HEIGHT * 0.1,
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
  contentContainer: {
    marginTop: SCREEN_HEIGHT * 0.015,
    marginBottom: SCREEN_HEIGHT * 0.003,
    width: '100%',
    alignItems: 'center',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: SCREEN_HEIGHT * 0.01,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  infoLabel: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    color: '#8B6914',
  },
  infoValue: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#5C4A0C',
  },
  divider: {
    width: '90%',
    height: 2,
    backgroundColor: '#CBA74E',
    marginVertical: SCREEN_HEIGHT * 0.015,
  },
  resetButton: {
    backgroundColor: '#DC2626',
    paddingVertical: SCREEN_HEIGHT * 0.01,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    marginTop: SCREEN_HEIGHT * 0.014,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  resetButtonText: {
    color: '#fff',
    fontFamily: 'BagelFatOne-Regular',
    fontSize: SCREEN_WIDTH * 0.04,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
