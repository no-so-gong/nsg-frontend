import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SplashScreen } from '@/components/SplashScreen';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useFonts } from 'expo-font';
import InitScreen from '@/screens/InitScreen';
import useSplashStore from './zustand/useSplashStore';
import useLoadingStore from './zustand/useLoadingStore';

export default function App() {
  const { isSplashShown, hasShownSplash, showSplash } = useSplashStore();
  const { isLoading } = useLoadingStore();

  const [fontsLoaded] = useFonts({
    'Dokdo-Regular': require('./assets/fonts/Dokdo-Regular.ttf'),
    'BagelFatOne-Regular': require('./assets/fonts/BagelFatOne-Regular.ttf'),
  });

  useEffect(() => {
    if (!hasShownSplash && fontsLoaded) {
      showSplash();
    }
  }, [hasShownSplash, showSplash, fontsLoaded]);

  if (!fontsLoaded || isSplashShown) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <LoadingSpinner isVisible={isLoading} />
      <InitScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});