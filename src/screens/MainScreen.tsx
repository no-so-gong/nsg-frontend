import React from 'react';
import { View, Image, StyleSheet, ImageBackground, Text } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';

export default function MainScreen() {
  return (
    <ImageBackground
      source={require('@assets/images/Main.png')} // 파일명을 여기에 맞게
      style={styles.background}
      resizeMode="cover" // 또는 stretch, contain
    >
      {/* 여기에 컴포넌트들을 자유롭게 배치 */}
      {/* <View style={styles.overlay}>
        <Text style={styles.title}>곧 등장할 UI</Text>
      </View> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'flex-end', // 필요에 따라 변경
    alignItems: 'center',
  },
  overlay: {
    width: '90%',
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // 예시: 반투명 박스
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
