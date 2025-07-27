import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import InitialScreen from '../assets/image/InitialScreen.png';

const { height, width } = Dimensions.get('window');

export const Home = () => (
  <View style={styles.container}>
    <Image
      source={InitialScreen}
      style={styles.image}
      resizeMode="cover"  
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
  },
  image: {
    width: width,
    height: height,
  },
});
