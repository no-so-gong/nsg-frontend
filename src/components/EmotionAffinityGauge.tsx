import { View, StyleSheet, Text, Image, ViewStyle } from 'react-native';
import { SCREEN_WIDTH } from '@/constants/dimensions';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  value: number; // 0~100
  icon: any;     // require() 이미지
  containerStyle?: ViewStyle;
}

/* 현재 감정 게이지바 & 편애도 게이지바*/
export default function EmotionAffinityGauge({ value, icon, containerStyle }: Props) {
  const barWidth = SCREEN_WIDTH * 0.24;
  const barHeight = 32;
  const percent = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.container, containerStyle]}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />

      <View style={[styles.barWrapper, { width: barWidth, height: barHeight }]}>
        {/* 검은색 배경 + 흰 테두리 */}
        <View style={styles.outerBar}>
          {/* 공간 확보용 내부 패딩 */}
          <View style={styles.innerPadding}>
            {/* 채워지는 게이지 */}
            <LinearGradient
              colors={['#A1E887', '#FBE078']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.barFill,
                { width: `${percent}%` },
              ]}
            />
          </View>
        </View>

        <Text style={styles.valueText}>{percent}</Text>
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
    alignItems: 'center',
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
  innerPadding: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
  },
  valueText: {
    position: 'absolute',
    fontFamily: 'BagelFatOne-Regular',
    fontSize: 14,
    color: '#fff',
    zIndex: 2,
  },
  icon: {
    width: 45,
    height: 45,
    position: 'absolute',
    top: -7,
    left: -20,
    zIndex: 3,
  },
});
