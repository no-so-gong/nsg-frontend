import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SplashScreen } from './components/SplashScreen';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getHelloMessage } from '@/src/apis/hello';
import useSplashStore from "./zustand/useSplashStore"; 
import { Home } from './screens/Home';

export default function App() {
   const { isSplashShown, hasShownSplash, showSplash } = useSplashStore();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!hasShownSplash) {
      showSplash();
    }
  }, [hasShownSplash, showSplash]);

  //초기 API?
  useEffect(() => {
    const fetchHello = async () => {
      const msg = await getHelloMessage();
      setMessage(msg || '');
      setLoading(false);
    };

    fetchHello();
  }, []);

  if (isSplashShown) return <SplashScreen />;
  if (loading) return <LoadingSpinner />;


  return (
    <View style={styles.container}>
      <Home/>
      {/* <Text style={styles.text}>{message || 'Hello!'}</Text> */}
      <LoadingSpinner/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});