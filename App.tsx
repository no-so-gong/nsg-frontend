import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { getHelloMessage } from '@/src/apis/hello';

export default function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchHello = async () => {
      const msg = await getHelloMessage();
      setMessage(msg); // 상태 업데이트
    };
    fetchHello();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message || 'Loading...'}</Text>
    </View>
  );
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
