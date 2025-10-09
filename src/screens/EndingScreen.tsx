import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import BoneLabelSvg from '../components/BoneLabelSvg';
import useUserStore from '@zustand/useUserStore';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getEndingSummary, EndingSummaryData } from '../apis/endings';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
const { height, width } = Dimensions.get('window');

export const EndingScreen = () => {
  
  const navigation = useNavigation();
  const [summaryData, setSummaryData] = React.useState<EndingSummaryData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const userId = useUserStore((state) => state.userId);

  React.useEffect(() => {
    const fetchEndingData = async () => {
      if (!userId) {
        setError('User ID 찾을 수 없습니다.');
        setIsLoading(false);
        return;
      }
      try {
        const data = await getEndingSummary(userId);
        setSummaryData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEndingData();
  }, [userId]);

  const handleRestart = () => {
    console.log('Restart game');
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !summaryData) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error || '데이터를 불러올 수 없습니다.'}</Text>
      </View>
    );
  }

return (
  <View style={styles.fullScreenContainer}>
    <Image
      source={require('@assets/images/Ending.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    />
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentOverlay}>
        <View style={styles.resultsContainer}>
          <View style={styles.boneWrapper}>
            <BoneLabelSvg label="결과"/>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultText}>총 "{summaryData.totalPlayDays}"일 걸렸어요</Text>
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultText}>총 "{summaryData.totalUsedMoney}" 코인을 사용했어요</Text>
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultText}>
              {summaryData.runawayCount === 0
                ? '그 누구도 가출을 한 적이 없어요'
                : `총 ${summaryData.runawayCount}번 가출했어요`}
            </Text>
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultText}>{summaryData.consecutiveAttendanceDays}일 매일 연속 출석을 했어요</Text>
          </View>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>다시 키우기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'white', 
  },
  safeArea: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingTop: SCREEN_HEIGHT * 0.35,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
  },
  contentOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  container: { },
  center: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  topBanner: {
    width: '90%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6F4E37',
  },
  resultsContainer: {
    width: '90%',
    backgroundColor: '#FFDD82',
    borderRadius: 20,
    borderWidth: 10,
    borderColor: '#CBA74E',
    padding: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6F4E37',
    marginBottom: 10,
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 10,
    position: 'absolute',
    top: -15,
  },
  resultItem: {
    width: '100%',
    top:10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 20,
    backgroundColor: '#CBA74E80',   
  },
  resultText: {
    fontSize: 16,
    color: '#6F4E37',
    fontWeight: '500',
  },
  restartButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  restartButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  boneWrapper: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.038,
    alignSelf: 'center', 
    zIndex: 10,
  },
});