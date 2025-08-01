import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
import EmotionAffinityGauge from '@/components/EmotionAffinityGauge';

export default function MainScreen() {
  return (
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
            value={90}
            icon={require('@assets/icons/heart.png')}
          />
        </View>

        {/* 편애도 게이지 - 중앙 */}
        <View style={styles.centerGauge}>
          <EmotionAffinityGauge
            value={80}
            icon={require('@assets/icons/friend.png')}
          />
        </View>

        {/* 보유 돈 컴포넌트 자리 - 우측 */}
        <View style={styles.rightGauge}>
          {/* 추후: 보유 돈 표시 컴포넌트 */}
        </View>
      </View>
    </ImageBackground>
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
});
