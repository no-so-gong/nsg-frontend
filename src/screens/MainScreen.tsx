import React from 'react';
import { View, ImageBackground, StyleSheet, Image } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
import EmotionAffinityGauge from '@/components/EmotionAffinityGauge';
import MoneyStatus from '@/components/MoneyStatus';
import BoneLabelSvg from '@/components/BoneLabelSvg';
import IconActionButton from '@/components/IconActionButton';
import AttendanceBoard from '../components/AttendanceBoard';
import SVGButton from '@/components/SVGButton';

import { useEffect, useState } from 'react';
import useUserStore from '@zustand/useUserStore';
import { getPetInfo, PetInfo } from '@/apis/pets';
import { getUserProperty } from '@/apis/users';

export default function MainScreen() {

  // 사용자 info
  const userId = useUserStore((state) => state.userId);
  const [money, setMoney] = useState<number>(0);

  // 동물 info
  const [shibaInfo, setShibaInfo] = useState<PetInfo | null>(null);
  const [duckInfo, setDuckInfo] = useState<PetInfo | null>(null);
  const [chickInfo, setChickInfo] = useState<PetInfo | null>(null);

  // 출석 모달 상태
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(true);

  // 추후에 해당 화면의 animalId에 따라 Info를 선택해서 currentPetInfo에 주입
  // const getCurrentPetInfo = (animalId: number): PetInfo | null => {
  //   switch (animalId) {
  //     case 1: return shibaInfo;
  //     case 2: return duckInfo;
  //     case 3: return chickInfo;
  //     default: return null;
  //   }
  // };
  // const currentPetInfo = getCurrentPetInfo(currentAnimalId);

  // 동물의 info에 정보 불러오기
  useEffect(() => {
    const fetchPetInfos = async () => {
      if (!userId) return;
      // console.log(userId);
      try {
        const [shiba, duck, chick] = await Promise.all([
          getPetInfo({ animalId: 1, userId }), // 시바견 
          getPetInfo({ animalId: 2, userId }), // 오리
          getPetInfo({ animalId: 3, userId }), // 병아리
        ]);

        setShibaInfo(shiba);
        setDuckInfo(duck);
        setChickInfo(chick);
      } catch (error) {
        console.error('동물 정보 불러오기 실패:', error);
      }
    };

    fetchPetInfos();
  }, [userId]); // 현재는 userId가 변경되었을 때만 api 재호출(추후에는 care가 일어나는 것도 감지해서 호출)

  // 사용자의 보유 돈 불러오기
  useEffect(() => {
    const fetchMoney = async () => {
      if (!userId) return;

      try {
        const userProperty = await getUserProperty(userId);
        setMoney(userProperty.money);
      } catch (error) {
        console.error('골드 조회 실패:', error);
      }
    };

    fetchMoney();
  }, [userId]); // 현재는 userId가 변경되었을 때만 api 재호출(추후에는 돈이 사용되는 것을 감지해서 호출)

  return (
    <>
      {isAttendanceVisible && (
        <AttendanceBoard onClose={() => setIsAttendanceVisible(false)} />
      )}
      <ImageBackground
        source={require('@assets/images/Main.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* 상단 게이지들 */}
        <View style={styles.gaugeRow}>
          {/* 감정 게이지 - 좌측 */}
          <View style={styles.leftGauge}>
            <EmotionAffinityGauge
              value={shibaInfo?.currentEmotion ? Math.floor(shibaInfo.currentEmotion) : 0} // 추후: 어떤 동물이 나와 있는 페이지냐에 따라 shibaInfo, duckInfo, chickInfo를 가져와야 함
              icon={require('@assets/icons/heart.png')} // 현재 기분
            />
          </View>

          {/* 편애도 게이지 - 중앙 */}
          <View style={styles.centerGauge}>
            <EmotionAffinityGauge
              value={shibaInfo?.userPatternBias ? Math.floor(shibaInfo.userPatternBias * 100) : 0} // 추후: 어떤 동물이 나와 있는 페이지냐에 따라 shibaInfo, duckInfo, chickInfo를 가져와야 함
              icon={require('@assets/icons/friend.png')} // 편애도
            />
          </View>

          {/* 보유 돈 컴포넌트 자리 - 우측 */}
          <View style={styles.rightGauge}>
            <MoneyStatus
              value={money}
              icon={require('@assets/icons/money.png')}
            />
          </View>
        </View>

       {/* 유저 버튼 및 게임 버튼 */}
      <View style={styles.userGameWrapper}>
        <BoneLabelSvg
          label={shibaInfo?.name ? shibaInfo.name : "미정"} // 추후: 어떤 동물이 나와 있는 페이지냐에 따라 shibaInfo, duckInfo, chickInfo를 가져와야 함
          widthRatio={0.2}
          style={styles.userName}
        />
        <SVGButton
          iconName="gamepad-variant"
          iconSize={30}
          iconColor="#fff"
          label="게임"
          backgroundColor="#CBA74E"
          style={{ marginLeft: -15 }}
          // onPress={() => navigation.navigate('')}

        />
        <SVGButton
          iconName="calendar-check"
          iconSize={28}
          iconColor="#fff"
          label="출석"
          backgroundColor="#CBA74E"
          style={{ marginLeft: -15 }}
          // onPress={() => navigation.navigate('')}
        />
      </View>


        {/* 중앙에 시바견 이미지 */}
        <View style={styles.animalWrapper}>
          <Image
            source={require('@assets/images/shiba_image4.png')} // 추후에는 컴포넌트로 동물 타입, 현재 기분 넘겨주면 알맞는 이미지가 나오도록 수정 예정
            style={styles.animalImage}
            resizeMode="contain"
          />
        </View>

        {/* 하단 액션 버튼들 */}
        <View style={styles.actionButtonRow}>
          <IconActionButton
            icon={require('@assets/icons/play.png')}
            iconSize={92}
          // onPress={() => setVisibleModal('play')} // 추후에 누르면, 놀기 카테고리 화면 나오기
          />
          <IconActionButton
            icon={require('@assets/icons/feed.png')}
            iconSize={92}
          // onPress={() => setVisibleModal('feed')} // 추후에 누르면, 밥 주기 카테고리 화면 나오기
          />
          <IconActionButton
            icon={require('@assets/icons/gift.png')}
            iconSize={92}
          // onPress={() => setVisibleModal('gift')} // 추후에 누르면, 선물하기 카테고리 화면 나오기
          />
        </View>


      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  gaugeRow: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftGauge: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerGauge: {
    flex: 1,
    alignItems: 'center',
  },
  rightGauge: {
    flex: 1,
    alignItems: 'flex-end',
  },
  userGameWrapper: {
    position: 'absolute',
    top: 110,
    left: 24,
    alignItems: 'center',
    gap: 10,
  },
  userName: {
    marginLeft: -14
  },
  gameIcon: {
    marginLeft: -14
  },
  actionButtonRow: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: SCREEN_WIDTH,
    paddingHorizontal: 32,
  },
  animalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  animalImage: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
  },
});