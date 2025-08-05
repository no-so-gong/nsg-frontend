import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';

interface Props {
  icon: any; // require(...) 이미지
  onPress?: () => void;
  style?: ViewStyle;
  iconSize?: number; // 아이콘 크기 (정사각형 기준)
}

export default function IconActionButton({
  icon,
  onPress = () => {},
  style,
  iconSize = 32, // 기본값 32
}: Props) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.8}>
      <Image source={icon} style={[styles.icon, { width: iconSize, height: iconSize }]} resizeMode="contain" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // 배경 제거
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 6,
  } as ImageStyle,
});
