import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Modal, Image, Animated, TouchableOpacity } from 'react-native';
import BoneLabelSvg from './BoneLabelSvg';
import CommonButton from './CommonButton';
import MoneyStatus from './MoneyStatus';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
import { LoadingSpinner } from './LoadingSpinner';
import usePriceListStore from '@zustand/usePriceListStore';
import useLoadingStore from '@zustand/useLoadingStore';
import usePetStore from '@zustand/usePetStore';
import Feed1 from "@assets/icons/feed1.png";
import Feed2 from "@assets/icons/feed2.png";
import Feed3 from "@assets/icons/feed3.png";

import Play1 from "@assets/icons/play1.png";
import Play2 from "@assets/icons/play2.png";
import Play3 from "@assets/icons/play3.png";

import Gift1 from "@assets/icons/gift1.png";
import Gift2 from "@assets/icons/gift2.png";
import Gift3 from "@assets/icons/gift3.png";

import useMoneyStore from '@zustand/useMoneyStore';
import useUserStore from '@zustand/useUserStore';
import { performCareAction } from '@/apis/cares';
import { getUserProperty } from '@/apis/users';
import { calculateActionId } from 'utils/actionIdCalculator';
import { getPetInfo } from '@/apis/pets';

interface CategoryBoardProps {
  category: 'feed' | 'play' | 'gift';
  onClose: () => void;
}

// 가격 하드(기본값) + label을 통해 서버 응답 키와 매칭
const CATEGORY_ITEMS = {
  feed: [
    { id: 1, image: Feed1, price: 30, label: '시장 사료' },
    { id: 2, image: Feed2, price: 40, label: '마트 사료' },
    { id: 3, image: Feed3, price: 50, label: '유기농 사료' },
  ],
  play: [
    { id: 1, image: Play1, price: 30, label: '산책 가기' },
    { id: 2, image: Play2, price: 40, label: '공 놀이' },
    { id: 3, image: Play3, price: 50, label: '애견 카페 가기' },
  ],
  gift: [
    { id: 1, image: Gift1, price: 30, label: '장난감 사주기' },
    { id: 2, image: Gift2, price: 40, label: '예쁜 옷 사주기' },
    { id: 3, image: Gift3, price: 50, label: '유모차 사주기' },
  ],
};

export default function CategoryBoard({ category, onClose }: CategoryBoardProps) {
  const [categoryItems, setCategoryItems] = useState(CATEGORY_ITEMS[category]);
  const fetchPrices = usePriceListStore(state => state.fetchPrices);
  const pricesByCategory = usePriceListStore(state => state.pricesByCategory);
  const isLoading = useLoadingStore(state => state.isLoading);
  const currentPetId = usePetStore(state => state.currentPetId);
  const currentPetEvolutionStage = usePetStore(state => state.currentPetEvolutionStage);

  const userId = useUserStore(state => state.userId);
  const setMoney = useMoneyStore(state => state.setMoney);
  const spendMoney = useMoneyStore(state => state.spendMoney);

  // 사용자가 선택한 아이템의 '로컬 ID'(1, 2, 3)를 저장할 상태 → Board 뜬 순서대로 1, 2, 3.
  const [selectedLocalItemId, setSelectedLocalItemId] = useState<number | null>(null);

  // 중복 클릭 방지용 상태
  const [isProcessing, setIsProcessing] = useState(false);

  // 애니메이션을 위한 값
  const scaleAnim = useState(new Animated.Value(1))[0]; // 초기 스케일 1

  const setPetInfo = usePetStore(state => state.setPetInfo);

  // 카테고리 또는 동물 변경 시 가격 목록 호출
  useEffect(() => {
    setCategoryItems(CATEGORY_ITEMS[category]);
    setSelectedLocalItemId(null); // 카테고리 변경 시 선택 초기화
  }, [category]);

  useEffect(() => {
    if (!currentPetId || !currentPetEvolutionStage) return;
    // 캐시 우선 사용. 강제 새로고침이 필요하면 forceRefresh: true 전달
    fetchPrices({ category, animalId: currentPetId, evolutionStage: currentPetEvolutionStage });
  }, [category, currentPetId, currentPetEvolutionStage, fetchPrices]);

  // 아이템 선택 시 애니메이션 효과
  const handleItemSelect = (itemId: number) => {
    setSelectedLocalItemId(itemId);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05, // 살짝 커짐
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // 다시 원래 크기로
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePurchase = async () => {
    if (isProcessing) return;
    if (selectedLocalItemId === null) {
      alert('구입할 상품을 선택해주세요.');
      return;
    }

    if (currentPetId === null) {
      alert('현재 펫 정보를 불러올 수 없습니다.');
      return;
    }

    setIsProcessing(true);

    if (!userId) {
      alert('사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.');
      setIsProcessing(false);
      return;
    }

    const selectedItemInfo = CATEGORY_ITEMS[category].find(item => item.id === selectedLocalItemId);
    if (!selectedItemInfo) {
      setIsProcessing(false);
      return;
    }

    const fallbackKey = `${category}${selectedLocalItemId}`;
    const price = pricesByCategory[category]?.[fallbackKey] ?? selectedItemInfo.price;

    try {
      // performCareAction 함수로 행동 요청
      const actionIdToSend = calculateActionId(
        category,
        selectedLocalItemId,
        currentPetEvolutionStage || 1
      );

      const actionResult = await performCareAction({
        animal_id: currentPetId,
        action_id: actionIdToSend,
      }, userId);

      // 세 동물 모두의 정보를 다시 가져옵니다 (편애도가 모두 변경되었을 수 있음)
      const allUpdatedPetsInfo = await Promise.all([
        getPetInfo({ animalId: 1, userId }),
        getPetInfo({ animalId: 2, userId }),
        getPetInfo({ animalId: 3, userId }),
      ]);

      // getUserProperty 함수로 현재 돈 조회 요청
      const moneyGetResult = await getUserProperty(userId);

      // 최신 펫 정보로 전역 스토어를 업데이트합니다 (모든 동물)
      allUpdatedPetsInfo.forEach(petInfo => {
        setPetInfo(petInfo);
      });

      // --- 모든 요청 성공 ---
      // Zustand store 업데이트 (navbar 반영)
      spendMoney(price);

      alert(`${actionResult.actionPerformed} 구입 완료!`);
      onClose();

    } catch (error: any) {
      console.error('구입 실패:', error);
      alert(error.message); // API 함수에서 throw된 에러 메시지를 표시
    } finally {
      setIsProcessing(false);
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
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.boneWrapper}>
              <BoneLabelSvg label="상점" />
            </View>
            {isLoading ? (
              <LoadingSpinner isVisible={true} />
            ) : (
              <View style={styles.boardContainer}>
                {categoryItems.map(item => {
                  const prices = pricesByCategory[category];
                  const labelKey = (item as any).label as string | undefined;
                  const fallbackKey = `${category}${item.id}`; // 예: gift1, play2, feed3
                  const dynamicPrice =
                    (prices && labelKey !== undefined && prices[labelKey] !== undefined
                      ? prices[labelKey]
                      : prices && prices[fallbackKey] !== undefined
                        ? prices[fallbackKey]
                        : item.price);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.itemWrapper}
                      onPress={() => handleItemSelect(item.id)}
                    >
                      <Animated.View
                        style={
                          selectedLocalItemId === item.id && { transform: [{ scale: scaleAnim }] }
                        }
                      >
                        <Image source={item.image} style={styles.itemImage} />
                        <MoneyStatus
                          value={dynamicPrice}
                          icon={require('@assets/icons/money.png')}
                          isSelected={selectedLocalItemId === item.id}
                        />
                      </Animated.View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            <View style={styles.buttonRow}>
              <CommonButton label="구입" onPress={handlePurchase} />
              <CommonButton label="취소" onPress={onClose} />
            </View>
          </View>
        </View>
      </View>
    </Modal >
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
  boardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SCREEN_HEIGHT * 0.015,
    marginBottom: SCREEN_HEIGHT * 0.002,
    width: '100%',
  },
  itemWrapper: {
    alignItems: 'stretch', // default stretch
    width: 80,
  },
  selectedItem: { // 선택된 아이템의 강조 효과
    borderColor: '#ff0000ff', // 녹색 테두리
    borderWidth: 3,
    borderRadius: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
