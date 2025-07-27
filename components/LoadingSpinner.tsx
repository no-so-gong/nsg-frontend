import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import Bone from "../assets/icon/bone.svg";

export const LoadingSpinner = () => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 250], 
  });

  return (
    <View style={styles.container}>
     <View style={styles.titleWrapper}>
        <View style={styles.imageWrapper}>
          <Image source={Bone} style={styles.image} />
          <Text style={styles.titleText}>알림</Text>
        </View>
      </View>


      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.stripes,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>

      <Text style={styles.loadingText}>로딩 중.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 110,
    backgroundColor: '#f4d67c',
    borderRadius: 20,
    borderColor: '#c0a154',
    borderWidth: 5,
    paddingTop: 30,
    paddingHorizontal: 20,
    elevation: 5,
    alignItems: 'center',
  },

  progressBar: {
    marginTop: 10,
    width: '100%',
    height: 20,
    backgroundColor: '#f2b04c',
    borderRadius: 10,
    overflow: 'hidden',
  },
  stripes: {
    height: '100%',
    width: '150%', 
    backgroundColor: '#ff9933',
    opacity: 0.7,
  },
  loadingText: {
    marginTop: 10,
    fontWeight: '700',
    color: 'white',
    fontSize: 16,
  },
    
  titleWrapper: {
    position: 'absolute',
    top: -30,
    left: 20,
  },

  imageWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  titleText: {
    position: 'absolute',
    color: '#c0a154',
    fontWeight: 'bold',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

});
