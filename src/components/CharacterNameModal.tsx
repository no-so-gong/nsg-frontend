import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import BoneLabelSvg from './BoneLabelSvg';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/dimensions';
import CommonButton from './CommonButton';

interface Props {
  visible: boolean;
  names: { shiba: string; chick: string; duck: string };
  onComplete: (names: { shiba: string, chick: string, duck: string }) => void;
}

export default function CharacterNameModal({ visible, names, onComplete }: Props) {
  const [localNames, setLocalNames] = useState(names);

  const handleChange = (key: keyof typeof localNames, value: string) => {
    const charCount = [...value].length;
    if (charCount <= 10) {
      setLocalNames({ ...localNames, [key]: value });
    }
  };

  const handleSubmit = () => {
    const isValid = Object.values(localNames).every((name) => name.trim().length > 0)
      && Object.values(localNames).every((name) => name.length <= 10);

    if (!isValid) {
      Alert.alert('이름 오류', '이름을 모두 입력하고 10자 이내로 해주세요.');
      return;
    }

    onComplete(localNames);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.boneWrapper}>
              <BoneLabelSvg label="알림" />
            </View>
            <Text style={styles.title}>✨ 드디어 만났어요!</Text>
            <Text style={styles.subtitle}>
              앞으로 함께할 우리 친구들을 소개할게요.{"\n"}한 번 정해진 이름은 바꿀 수 없어요.
            </Text>

            {['shiba', 'chick', 'duck'].map((type) => (
              <View style={styles.row} key={type}>
                <Text style={styles.label}>
                  {type === 'shiba' ? '🐶 시바견' : type === 'chick' ? '🐥 병아리' : '🦆 오리'}
                  ({localNames[type as keyof typeof localNames].length}/10):
                </Text>
                <TextInput
                  style={styles.input}
                  value={localNames[type as keyof typeof localNames]}
                  onChangeText={(text) => handleChange(type as keyof typeof localNames, text)}
                />
              </View>
            ))}

            <CommonButton label="만나러 가기" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0000004D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#CBA74E',
    borderRadius: SCREEN_WIDTH * 0.08,
    padding: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.88,
    marginHorizontal: SCREEN_HEIGHT * 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  innerContainer: {
    backgroundColor: '#FFDD82',
    borderRadius: SCREEN_WIDTH * 0.05,
    padding: SCREEN_WIDTH * 0.04,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontFamily: 'BagelFatOne-Regular',
    color: '#FFF',
    alignSelf: 'flex-start',
    marginTop: SCREEN_HEIGHT * 0.015,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.02,
    color: '#FFF',
    fontFamily: 'BagelFatOne-Regular',
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SCREEN_HEIGHT * 0.007,
    width: '100%',
    paddingVertical: SCREEN_HEIGHT * 0.005,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    borderRadius: 20,
    backgroundColor: '#CBA74E80',
  },
  label: {
    fontFamily: 'BagelFatOne-Regular',
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#FFF',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontFamily: 'BagelFatOne-Regular',
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#FFF',
  },
  boneWrapper: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.038,
    left: SCREEN_WIDTH * 0.05,
    zIndex: 10,
  },
});
