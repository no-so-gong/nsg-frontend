import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { getHelloMessage } from '@/src/apis/hello';
import InitScreen from '@/src/screens/InitScreen';
import { useFonts } from 'expo-font';

export default function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchHello = async () => {
      const msg = await getHelloMessage();
      setMessage(msg);
    };
    fetchHello();
  }, []);

  const [fontsLoaded] = useFonts({
    'Dokdo-Regular': require('./assets/fonts/Dokdo-Regular.ttf'),
    'BagelFatOne-Regular': require('./assets/fonts/BagelFatOne-Regular.ttf'),
  }); // splash 완성 후 적용 → 폰트 로드 되면 splash 사라지게

  return <InitScreen/>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20
  }
});
