import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
// import Splash from "../assets/image/Splash.png";

const { height, width } = Dimensions.get('window');

export const SplashScreen = () => (
  <View style={styles.container}>
    <Image source={require('../assets/image/Splash.png')} style={styles.image} />
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
