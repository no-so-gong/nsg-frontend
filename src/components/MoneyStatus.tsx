import React from 'react';
import { View, StyleSheet, Text, Image, ViewStyle } from 'react-native';
import { SCREEN_WIDTH } from '@/constants/dimensions';
import useMoneyStore from '@zustand/useMoneyStore';

interface Props {
  value?: number;
  icon: any; // require() 이미지
  containerStyle?: ViewStyle;
  isSelected?: boolean;
}

/*현재 보유 돈 상태바*/
export default function MoneyStatus({ value, icon, containerStyle, isSelected = false }: Props) {
  const storeMoney = useMoneyStore(state => state.money);
  const barWidth = SCREEN_WIDTH * 0.24;
  const barHeight = 32;

  return (
    <View style={[styles.container, containerStyle]}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />

      <View style={[styles.barWrapper, { width: barWidth, height: barHeight }]}>
        <View style={[styles.outerBar, isSelected && styles.selectedOuterBar]}>
          {/* 내부는 비워두고 숫자만 오른쪽 정렬 */}
        </View>

        <Text style={[styles.valueText, isSelected && styles.selectedValueText]}>{value ?? storeMoney}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  barWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'relative',
  },
  outerBar: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#fff',
    padding: 3,
  },
  selectedOuterBar: {
    borderColor: '#207122ff',
  },
  valueText: {
    position: 'absolute',
    right: 10,
    fontFamily: 'BagelFatOne-Regular',
    fontSize: 18,
    color: '#fff',
    zIndex: 2,
  },
  selectedValueText: {
    color: '#46cc75ff',
  },
  icon: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: 0,
    left: -10,
    zIndex: 3,
  },
});
