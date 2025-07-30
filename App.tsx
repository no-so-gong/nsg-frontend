import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SplashScreen } from './components/SplashScreen';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getHelloMessage } from '@/src/apis/hello';
import useSplashStore from "./zustand/useSplashStore"; 
import useLoadingStore from './zustand/useLoadingStore';
import { fetchWithLoading } from './utils/fetchWithLoading';

export default function App() {
  const { isSplashShown, hasShownSplash, showSplash } = useSplashStore();
  const { isLoading, setLoading } = useLoadingStore();
  const [message, setMessage] = useState(''); //초기 API?

  useEffect(() => {
    if (!hasShownSplash) {
      showSplash();
    }
  }, [hasShownSplash, showSplash]);

  useEffect(() => {
    const fetchHello = async () => {
      const msg = await fetchWithLoading(getHelloMessage); //이런식으로 API 호출과 동시에 자동 로딩 처리
      setMessage(msg || '');
    };
    fetchHello();
  }, []);


  if (isSplashShown) return <SplashScreen />;

  return (
    <View style={styles.container}>
      <LoadingSpinner isVisible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});