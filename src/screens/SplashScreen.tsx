import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const SplashScreen = () => (
  <View style={styles.container}>
    <Image source={require('@assets/images/Splash.png')} style={styles.image} />
    {/* <Image
      source={Splash} 
      style={styles.image}
      resizeMode="cover"
    /> */}
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
