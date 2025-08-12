import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  View,
  StyleProp
} from 'react-native';

interface Props {
  icon: any;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;  // StyleProp으로 변경
  iconSize?: number;
}
export default function IconActionButton({
  icon,
  onPress = () => {},
  style,
  iconSize = 32,
}: Props) {
  const isSvg = typeof icon === 'function';
  const IconComponent = icon;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isSvg ? (
        <View style={{ width: iconSize, height: iconSize }}>
          <IconComponent width={iconSize} height={iconSize} />
        </View>
      ) : (
        <Image
          source={icon}
          style={[styles.icon, { width: iconSize, height: iconSize }]}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 6,
  } as ImageStyle,
});
