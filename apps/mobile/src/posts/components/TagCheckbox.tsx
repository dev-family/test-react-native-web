import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {PostTag} from '../types';
import {Colors} from '../../ui/constants/colors';
import React, {useEffect} from 'react';
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {text} from '../../../assets/styles/text';

type TagCheckboxProps = {
  tag: PostTag;
  isSelected: boolean;
  onPress: (id: number) => void;
};

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

export const TagCheckbox: React.FC<TagCheckboxProps> = ({
  tag,
  isSelected,
  onPress,
}) => {
  const selected =
    Platform.OS === 'web'
      ? useSharedValue(isSelected ? 1 : 0)
      : (useDerivedValue(
          () => (isSelected ? 1 : 0),
          [isSelected],
        ) as SharedValue<number>);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    selected.value = isSelected ? 1 : 0;
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: withTiming(
        interpolateColor(selected.value, [0, 1], [Colors.dark, Colors.primary]),
      ),
      borderWidth: interpolate(selected.value, [0, 1], [1, 0]),
    }),
    [isSelected],
  );

  return (
    <AnimatedButton
      style={[styles.tag, animatedStyle]}
      onPress={() => onPress?.(tag.id)}>
      <Text
        style={[
          text.m,
          isSelected && text.medium,
          isSelected && text.white,
          isSelected && text.semiBold,
        ]}>
        {tag.value}
      </Text>
    </AnimatedButton>
  );
};

const styles = StyleSheet.create({
  tag: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 15,
    justifyContent: 'center',
  },
});
