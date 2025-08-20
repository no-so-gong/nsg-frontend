import React from 'react';
import { View, Text, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CircleIconButtonProps {
  size?: number;           
  backgroundColor?: string;  
  iconName: string;          
  iconSize?: number;         
  iconColor?: string;        
  label?: string;            
  labelStyle?: TextStyle;    
  style?: ViewStyle;        
  onPress?: () => void;    
}

const SVGButton: React.FC<CircleIconButtonProps> = ({
  size = 60,
  backgroundColor = '#CBA74E',
  iconName,
  iconSize = 30,
  iconColor = '#fff',
  label = '',
  labelStyle,
  style,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[{ width: size, alignItems: 'center' }, style]}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon name={iconName} size={iconSize} color={iconColor} />
        {label ? (
        <Text style={[{ marginTop: 4, textAlign: 'center', fontSize: 12, color: '#fff' }, labelStyle]}>
          {label}
        </Text>
      ) : null}
      </View>
    
    </TouchableOpacity>
  );
};

export default SVGButton;
