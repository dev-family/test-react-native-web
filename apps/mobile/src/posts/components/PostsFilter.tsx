import {
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useScreenInsets} from '../../ui/constants/insets';
import {PostTag} from '../types';
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import {text} from '../../../assets/styles/text';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from '../../ui/constants/colors';

type PostsFilterProps = {
  data: PostTag[];
  selectedTag: number;
  setSelectedTag: Dispatch<SetStateAction<number>>;
  onPress?: (item: PostTag) => void;
};

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

const Tag: React.FC<
  PropsWithChildren<{isSelected?: boolean; onPress?: () => void}>
> = ({children, isSelected, ...props}) => {
  const selected = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    selected.value = isSelected ? 1 : 0;
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        interpolateColor(
          selected.value,
          [0, 1],
          [Colors.dark, Colors.primaryTransparent],
        ),
      ),
      borderColor: withTiming(
        interpolateColor(
          selected.value,
          [0, 1],
          [Colors.tertiary, Colors.primary],
        ),
      ),
      borderWidth: interpolate(selected.value, [0, 1], [1, 1.5]),
    };
  }, [isSelected]);

  return (
    <AnimatedButton
      style={[
        styles.item,
        Platform.OS !== 'web'
          ? animatedStyle
          : isSelected
          ? styles.selected
          : styles.tag,
      ]}
      {...props}>
      <Text
        style={[
          text.m,
          text.medium,
          isSelected && text.bold,
          {color: Colors.text},
        ]}>
        {children}
      </Text>
    </AnimatedButton>
  );
};

export const PostsFilter: React.FC<PostsFilterProps> = ({
  data,
  onPress,
  selectedTag,
}) => {
  const {insetsHorizontal: paddingHorizontal, insetsTopHeader: top} =
    useScreenInsets();

  const handlePress = (item: PostTag) => {
    onPress?.(item);
  };

  const renderItem: ListRenderItem<PostTag> = useCallback(
    ({item}) => (
      <Tag
        isSelected={selectedTag === item.id}
        onPress={() => handlePress(item)}>
        {item.value}
      </Tag>
    ),
    [data, selectedTag],
  );

  return (
    <FlatList
      data={data}
      style={[
        styles.list,
        {
          backgroundColor: 'transparent',
        },
      ]}
      horizontal
      contentContainerStyle={[
        styles.listContent,
        {
          paddingHorizontal,
          backgroundColor: 'transparent',
        },
      ]}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    paddingVertical: 10,
  },
  list: {
    maxHeight: 50,
  },
  listContent: {
    maxHeight: 50,
    gap: 10,
    paddingTop: 5,
    paddingBottom: 10,
  },
  item: {
    paddingHorizontal: 20,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    borderWidth: 1,
  },
  selected: {
    backgroundColor: Colors.primaryTransparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  tag: {},
});
