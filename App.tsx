import React, { useEffect, useState } from 'react';
import { RootStackParamList } from '@/types/navigationTypes';
import { View, StyleSheet } from 'react-native';
import { SplashScreen } from '@/screens/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useFonts } from 'expo-font';
import InitScreen from '@/screens/InitScreen';
import MainScreen from '@/screens/MainScreen';
import GameScreen from '@/game/GameScreen';
import useSplashStore from '@zustand/useSplashStore';
import useLoadingStore from '@zustand/useLoadingStore';
import useUserStore from '@zustand/useUserStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { isSplashShown, hasShownSplash, showSplash } = useSplashStore();
  const { isLoading } = useLoadingStore();

  const loadUserId = useUserStore((state) => state.loadUserId);

  const [fontsLoaded] = useFonts({
    'Dokdo-Regular': require('@assets/fonts/Dokdo-Regular.ttf'),
    'BagelFatOne-Regular': require('@assets/fonts/BagelFatOne-Regular.ttf'),
  });

  useEffect(() => {
    loadUserId();
  }, []);

  useEffect(() => {
    if (!hasShownSplash && fontsLoaded) {
      showSplash();
    }
  }, [hasShownSplash, showSplash, fontsLoaded]);

  if (!fontsLoaded || isSplashShown) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <LoadingSpinner isVisible={isLoading} />
      <Stack.Navigator initialRouteName="InitScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="InitScreen" component={InitScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="GameScreen" component={GameScreen} options={{ gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});