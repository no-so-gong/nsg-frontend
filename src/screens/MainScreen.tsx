import { View, ImageBackground, StyleSheet, Image, FlatList } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
import EmotionAffinityGauge from '@/components/EmotionAffinityGauge';
import MoneyStatus from '@/components/MoneyStatus';
import BoneLabelSvg from '@/components/BoneLabelSvg';
import IconActionButton from '@/components/IconActionButton';
import AttendanceBoard from '@/components/AttendanceBoard';
import CategoryBoard from '@/components/CategoryBoard';
import SVGButton from '@/components/SVGButton';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import useUserStore from '@zustand/useUserStore';
import { getPetInfo } from '@/apis/pets';
import { getUserProperty } from '@/apis/users';
import { getAnimalImageByEmotion } from '@/components/animalImages';
import usePetStore from '@zustand/usePetStore';
import useMoneyStore from '@zustand/useMoneyStore';
import GameScreen from '@/game/GameScreen';
import { EndingScreen } from './EndingScreen';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainScreen'>;

// 펫의 기본 정의를 상수로 관리하여 확장성 확보
const PET_DEFINITIONS = [
  { id: 1, defaultImage: require('@assets/images/shiba_image4.png') },
  { id: 2, defaultImage: require('@assets/images/duck_image4.png') },
  { id: 3, defaultImage: require('@assets/images/chick_image4.png') },
];

export default function MainScreen() {
  const navigation = useNavigation<NavigationProp>();

  const {
    petsInfo,
    setCurrentPetImage,
    setCurrentPetId,
    setCurrentPetEvolutionStage,
    initializePets, // 펫 정보 전체를 초기화하는 액션
  } = usePetStore();

  const [visibleModal, setVisibleModal] = useState<null | 'feed' | 'play' | 'gift'>(null);
  const [visibleGameModal, setVisibleGameModal] = useState<null | 'ddong' | 'tetris' | 'snake'>(null);

  // 사용자 info
  const userId = useUserStore((state) => state.userId);
  const setMoneyStore = useMoneyStore(state => state.setMoney);
  const moneyStoreValue = useMoneyStore(state => state.money);

  // 출석 모달 상태
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(true);

  // 상점 모달 상태
  const [isCategoryVisible, setIsCategoryVisible] = useState(true);

  // 현재 렌더링 중인 동물 인덱스 상태
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);

  const pets = PET_DEFINITIONS.map(petDef => ({
    id: petDef.id,
    image: petDef.defaultImage,
    info: petsInfo[petDef.id] ?? null,
  }));

  const currentPetInfo = pets[currentAnimalIndex]?.info;

  // 동물의 info에 정보 불러오기
  useEffect(() => {
    const fetchPetInfos = async () => {
      if (!userId) return;
      try {
        // Promise.all로 모든 펫 정보를 한 번에 가져옵니다.
        const allPetsInfo = await Promise.all([
          getPetInfo({ animalId: 1, userId }),
          getPetInfo({ animalId: 2, userId }),
          getPetInfo({ animalId: 3, userId }),
        ]);
        // 로컬 상태(setShibaInfo 등) 대신 전역 스토어의 `initializePets` 액션을 호출합니다.
        initializePets(allPetsInfo);
      } catch (error) {
        console.error('동물 정보 불러오기 실패:', error);
      }
    };

    fetchPetInfos();
  }, [userId, initializePets]);

  // 사용자의 보유 돈 불러오기
  useEffect(() => {
    const fetchMoney = async () => {
      if (!userId) return;

      try {
        const userProperty = await getUserProperty(userId);
        setMoneyStore(userProperty.money);
      } catch (error) {
        console.error('골드 조회 실패:', error);
      }
    };

    fetchMoney();
  }, [userId, setMoneyStore]);

  // 엔딩부분
  useEffect(() => {
    const petDetails = Object.values(petsInfo);
    if (petDetails.length < PET_DEFINITIONS.length) {
      return;
    }
    const isGameEnd = petDetails.every(
      (pet) => pet && pet.evolutionStage === 3
    );
    if (isGameEnd) {
      console.log('게임 종료 조건 충족! 엔딩 화면으로 이동합니다.');
      navigation.navigate('EndingScreen'); 
    }
  }, [petsInfo, navigation]); 

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
              value={currentPetInfo?.currentEmotion ? Math.floor(currentPetInfo.currentEmotion) : 0}
              icon={require('@assets/icons/hearts.png')} // 현재 기분
            />
          </View>

          {/* 편애도 게이지 - 중앙 */}
          <View style={styles.centerGauge}>
            <EmotionAffinityGauge
              value={currentPetInfo?.userPatternBias ? Math.floor(currentPetInfo.userPatternBias * 100) : 0}
              icon={require('@assets/icons/friend.png')} // 편애도
            />
          </View>

          {/* 보유 돈 컴포넌트 자리 - 우측 */}
          <View style={styles.rightGauge}>
            <MoneyStatus icon={require('@assets/icons/money.png')} />
          </View>
        </View>

        {/* 유저 버튼 및 게임 버튼 */}
        <View style={[styles.userGameWrapper, { zIndex: 10 }]}>
          <SVGButton
            iconName="gamepad-variant"
            iconSize={30}
            iconColor="#fff"
            label="게임"
            backgroundColor="#CBA74E"
            style={{ width: 100, height: 50, marginLeft: -15 }}
            onPress={() => {
              console.log("게임 버튼 클릭됨");
              const currentPet = pets[currentAnimalIndex];
              const emotion = currentPet.info?.currentEmotion ?? 0;
              const actualDisplayedImage = getAnimalImageByEmotion(
                currentPet.id,
                Math.floor(emotion)
              );

              setCurrentPetImage(actualDisplayedImage);
              setCurrentPetId(currentPet.id);
              setCurrentPetEvolutionStage(currentPet.info?.evolutionStage || 1);
              setVisibleGameModal('ddong');  // 기본 응아로
            }}
          />
          <SVGButton
            iconName="calendar-check"
            iconSize={28}
            iconColor="#fff"
            label="출석"
            backgroundColor="#CBA74E"
            style={{ marginLeft: -15 }}
            onPress={() => setIsAttendanceVisible(true)}
          />
        </View>

        {/* 중앙 동물 */}
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentAnimalIndex(index);
          }}
          renderItem={({ item }) => {
            const emotion = item.info?.currentEmotion ?? 0;
            const animalImage = getAnimalImageByEmotion(item.id, Math.floor(emotion));
            return (
              <View style={{ width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={animalImage} style={styles.animalImage} resizeMode="contain" />
                <BoneLabelSvg
                  label={item.info?.name ? item.info.name : "미정"}
                  widthRatio={0.2}
                  style={styles.userName}
                />
              </View>
            )
          }
          } />

        {/* 하단 액션 버튼들 */}
        <View style={styles.actionButtonRow}>
          <IconActionButton
            icon={require('@assets/icons/play.png')}
            iconSize={92}
            onPress={() => {
              const pet = pets[currentAnimalIndex];
              setCurrentPetId(pet.id);
              setCurrentPetEvolutionStage(pet.info?.evolutionStage || 1);
              setVisibleModal('play');
            }} // 추후에 누르면, 놀기 카테고리 화면 나오기
          />
          <IconActionButton
            icon={require('@assets/icons/feed.png')}
            iconSize={92}
            onPress={() => {
              const pet = pets[currentAnimalIndex];
              setCurrentPetId(pet.id);
              setCurrentPetEvolutionStage(pet.info?.evolutionStage || 1);
              setVisibleModal('feed');
            }} // 추후에 누르면, 밥 주기 카테고리 화면 나오기
          />
          <IconActionButton
            icon={require('@assets/icons/gift.png')}
            iconSize={92}
            onPress={() => {
              const pet = pets[currentAnimalIndex];
              setCurrentPetId(pet.id);
              setCurrentPetEvolutionStage(pet.info?.evolutionStage || 1);
              setVisibleModal('gift');
            }} // 추후에 누르면, 선물하기 카테고리 화면 나오기
          />
          {visibleModal && (
            <CategoryBoard
              category={visibleModal}
              onClose={() => setVisibleModal(null)}
            />
          )}
          {visibleGameModal && (
            <GameScreen
              visible={!!visibleGameModal}
              onClose={() => setVisibleGameModal(null)}
            />
          )}
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
    top: 140,
    left: 24,
    alignItems: 'center',
    gap: 20,
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