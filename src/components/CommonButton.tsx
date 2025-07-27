import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants/dimensions';

interface Props {
  label: string;
  onPress: () => void;
}

export default function CommonButton({ label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#92731A',
    paddingVertical: SCREEN_HEIGHT * 0.01,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    marginTop: SCREEN_HEIGHT * 0.014,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    color: '#fff',
    fontFamily: 'BagelFatOne-Regular',
    fontSize: SCREEN_WIDTH * 0.04,
    textAlign: 'center',
  },
});