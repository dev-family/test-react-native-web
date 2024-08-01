import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Icons, IconsType} from '../constants/icons';
import type {
  ImageStyle,
  StyleProp,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

export type IconProps = {
  name: IconsType;
  size: number | {width: number; height: number};
  color?: string;
  style?: StyleProp<ImageStyle>;
  onPress?: () => void;
  hitSlop?: TouchableOpacityProps['hitSlop'];
  containerStyle?: StyleProp<ViewStyle>;
};

export const Icon: React.FC<IconProps> = ({
  name,
  size,
  color,
  style,
  onPress,
  hitSlop,
  containerStyle,
}) => {
  const width = typeof size === 'number' ? size : size.width;
  const height = typeof size === 'number' ? size : size.height;
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        hitSlop={hitSlop}
        style={containerStyle}>
        <Image
          source={Icons[name]}
          style={[{height, width, tintColor: color}, style]}
        />
      </TouchableOpacity>
    );
  }
  return (
    <View style={containerStyle}>
      <Image
        source={Icons[name]}
        style={[{height, width, tintColor: color}, style]}
      />
    </View>
  );
};
