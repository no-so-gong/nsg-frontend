import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import CharacterNameModal from '../components/CharacterNameModal';
import { createUser } from '../apis/users';
import { registerNames } from '../apis/pets';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants/dimensions';

export default function InitScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const opacity = useState(new Animated.Value(0.3))[0];
  console.log('SCREEN_WIDTH:', SCREEN_WIDTH);
  console.log('SCREEN_HEIGHT:', SCREEN_HEIGHT);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  const handlePressAnywhere = () => {
    if (!modalVisible) {
      setModalVisible(true);
    }
  };

  const handleNameComplete = async (names: { shiba: string; chick: string; duck: string }) => {
    try {
      const userId = await createUser();
      const animals = [
        { animalId: 1, name: names.shiba },
        { animalId: 2, name: names.chick },
        { animalId: 3, name: names.duck },
      ];
      await registerNames({ userId, animals });
      Alert.alert('등록 완료', '친구들이 등록되었습니다!');
      // 다음 화면으로 navigation
    } catch (err) {
      Alert.alert('오류', '이름 저장 중 문제가 발생했어요.');
    }
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={1}
      onPress={handlePressAnywhere}
      disabled={modalVisible}
    >
      <ImageBackground
        source={require('@/assets/images/초기화면_배경.png')}
        style={styles.bg}
        resizeMode="stretch"
      >
        <Image
          source={require('@/assets/images/노답_삼형제_이걸_키우라고.png')}
          style={styles.title}
          resizeMode="contain"
        />
        <Image
          source={require('@/assets/images/삼형제_싸운다.png')}
          style={styles.characters}
          resizeMode="contain"
        />

        <Animated.Text style={[styles.flickerText, { opacity }]}>
          지금 안 누르면 계속 싸움남;;
        </Animated.Text>

        <CharacterNameModal
          visible={modalVisible}
          names={{ shiba: '', chick: '', duck: '' }}
          onComplete={handleNameComplete}
        />
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.04,
  },
  title: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.12,
    width: SCREEN_WIDTH * 0.76,
    height: SCREEN_HEIGHT * 0.24,
  },
  characters: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.38,
    bottom: SCREEN_HEIGHT * 0.12,
  },
  flickerText: {
    position: 'absolute',
    fontFamily: 'Dokdo-Regular',
    fontSize: SCREEN_WIDTH * 0.06,
    textAlign: 'center',
    color: '#000',
    bottom: SCREEN_HEIGHT * 0.09,
  },
});
