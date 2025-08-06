import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Modal } from 'react-native';
import BoneLabelSvg from './BoneLabelSvg';
import CommonButton from './CommonButton';
import MoneyIcon from '@assets/icons/money.svg';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
import { getAttendanceBoard, postAttendanceCheckin } from '@/apis/events';
import type { AttendanceDay } from '@/apis/events';
import useUserStore from '@zustand/useUserStore';
import { LoadingSpinner } from './LoadingSpinner';

interface AttendanceBoardProps {
  onClose: () => void;
}

export default function AttendanceBoard({ onClose }: AttendanceBoardProps) {
  const { userId } = useUserStore();
  const [board, setBoard] = useState<AttendanceDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 출석 정보 불러오기
  useEffect(() => {
    const fetchBoard = async () => {
      if (!userId) return;

      try {
        const response = await getAttendanceBoard(userId);
        setBoard(response.data.board);
      } catch (error: any) {
        console.error('출석 데이터 불러오기 실패', error);

        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
          Alert.alert('인증 오류', '유저 정보가 확인되지 않아요. 앱을 다시 시작해 주세요!');
        } else if (status === 500) {
          Alert.alert('서버 오류', '앗! 서버에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
        } else {
          Alert.alert('출석 정보 오류', '출석 정보를 불러오는 중 문제가 발생했어요ㅠㅠ');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoard();
  }, [userId]);

  // 출석 체크 처리
  const handleCheckin = async () => {
    if (!userId) return;

    try {
      const response = await postAttendanceCheckin(userId);
      Alert.alert('출석 완료', `${response.data.todayReward.amount} 코인을 받았어요!`);
      onClose();
    } catch (error: any) {
      console.error('출석 실패', error);

      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 401) {
        Alert.alert('인증 오류', '유저 정보가 확인되지 않아요. 앱을 다시 시작해 주세요!');
      } else if (status === 409) {
        Alert.alert('이미 출석했어요!', '오늘은 이미 출석을 완료했어요.');
        onClose();
      } else if (status === 500) {
        Alert.alert('서버 오류', '앗! 서버에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
      } else {
        Alert.alert('출석 실패', '출석 체크 중 알 수 없는 문제가 발생했어요ㅠㅠ');
      }
    }
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {isLoading ? (
        <LoadingSpinner isVisible={true} />
      ) : (
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <View style={styles.boneWrapper}>
                <BoneLabelSvg label="출석" />
              </View>
              <View style={styles.boardContainer}>
                {board.map((item) => (
                  <View
                    key={item.day}
                    style={[styles.dayBox, item.checkedIn && styles.checkedInBox]}
                  >
                    <Text style={styles.dayText}>{item.day}</Text>
                    <View style={styles.centerBox}>
                      <MoneyIcon
                        width={SCREEN_WIDTH * 0.04}
                        height={SCREEN_WIDTH * 0.04}
                      />
                      <Text style={styles.rewardText}>{item.reward}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <CommonButton label="보상받기" onPress={handleCheckin} />
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0000004D',
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
  boardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SCREEN_HEIGHT * 0.015,
    marginBottom: SCREEN_HEIGHT * 0.002,
    width: '100%',
  },
  dayBox: {
    backgroundColor: '#CBA74E',
    borderRadius: 10,
    paddingTop: SCREEN_HEIGHT * 0.001,
    paddingBottom: SCREEN_HEIGHT * 0.001,
    minWidth: SCREEN_WIDTH * 0.1,
  },
  checkedInBox: {
    backgroundColor: '#CBA74E',
    opacity: 0.5,
  },
  dayText: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.004,
    left: SCREEN_WIDTH * 0.01,
    fontSize: SCREEN_WIDTH * 0.03,
    fontWeight: 'bold',
    color: '#fff',
  },
  centerBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  icon: {
    width: SCREEN_WIDTH * 0.04,
    height: SCREEN_WIDTH * 0.04,
    marginVertical: 2,
  },
  rewardText: {
    fontSize: SCREEN_WIDTH * 0.03,
    color: '#fff',
    marginVertical: SCREEN_HEIGHT * 0.001,
  },
  boneWrapper: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.038,
    left: SCREEN_WIDTH * 0.29,
    zIndex: 10,
  },
});
