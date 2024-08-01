import React, {useState} from 'react';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Platform, StyleSheet, Text} from 'react-native';
import {text} from '../../../assets/styles/text';
import {Colors} from '../../ui/constants/colors';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Vote} from '../types';
import {Icon, Row} from '../../ui/components';

type VoteItemProps = {
  vote: Vote;
  onSubmitOption: (id: number) => void;
  completed?: boolean;
  selected: boolean;
};

export const VoteItem: React.FC<VoteItemProps> = ({
  vote,
  completed,
  onSubmitOption,
  ...props
}) => {
  const {percent} = vote;
  const [width, setWidth] = useState(0);
  const [swipe, setSwipe] = useState(0);

  const swipeValue = useSharedValue(0);

  const widthValue =
    Platform.OS === 'web'
      ? useSharedValue(0)
      : (useDerivedValue(
          () => (completed ? withTiming((percent / 100) * width) : width),
          [width, completed, percent],
        ) as SharedValue<number>);

  if (Platform.OS === 'web' && width) {
    widthValue.value = completed ? (percent / 100) * width : width;
  }

  const selected = useDerivedValue(
    () => (completed && props.selected ? 1 : 0),
    [props.selected, completed],
  ) as SharedValue<number>;

  if (Platform.OS === 'web' && completed && props.selected) {
    selected.value = 1;
  }
  const submitOption = () => {
    onSubmitOption(vote.id);
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      swipeValue.value = 0;
      if (Platform.OS === 'web') runOnJS(setSwipe)(0);
    })
    .onUpdate(e => {
      if (e.translationX < 0) {
        swipeValue.value = 0;
        if (Platform.OS === 'web') runOnJS(setSwipe)(0);
        return;
      }
      if (e.translationX > width) {
        swipeValue.value = width;
        if (Platform.OS === 'web') runOnJS(setSwipe)(width);
        runOnJS(submitOption)();
        return;
      }
      const value = e.translationX;

      swipeValue.value = value;
      if (Platform.OS === 'web') runOnJS(setSwipe)(value);
    })
    .onEnd(e => {
      if (e.translationX > width / 2) {
        swipeValue.value =
          Platform.OS === 'web' ? width : withTiming(width, {duration: 100});
        if (Platform.OS === 'web') runOnJS(setSwipe)(width);
        runOnJS(submitOption)();
      } else {
        swipeValue.value =
          Platform.OS === 'web' ? 0 : withTiming(0, {duration: 100});
        if (Platform.OS === 'web') runOnJS(setSwipe)(0);
      }
    })
    .activateAfterLongPress(300)
    .enabled(!completed);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: swipeValue.value,
    };
  }, [swipeValue, width, swipe]);

  const completedStyle = useAnimatedStyle(
    () => ({
      borderColor: interpolateColor(
        selected.value,
        [0, 1],
        [Colors.textSecondary, Colors.primary],
      ),
      borderWidth: interpolate(selected.value, [0, 1], [1, 2]),
    }),
    [selected, completed, props.selected],
  );

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: widthValue.value,
      borderTopRightRadius: completed ? 14 : 0,
      borderBottomRightRadius: completed ? 14 : 0,
    };
  }, [completed, widthValue, width]);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[styles.vote, completedStyle]}
        onLayout={e => {
          setWidth(e.nativeEvent.layout.width);
        }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              zIndex: 0,
              backgroundColor: Colors.primaryTransparent,
              alignSelf: 'flex-start',
              height: '100%',
            },
            progressStyle,
          ]}
        />
        {!completed && (
          <Animated.View
            style={[styles.vote, styles.absoluteContainer, animatedStyle]}>
            <Row center gap={14} style={{width}}>
              <Icon size={20} name="post.rapid" color={Colors.dark}></Icon>
              <Text style={[text.l, text.semiBold, text.center, text.white]}>
                {vote.option}
              </Text>
            </Row>
          </Animated.View>
        )}

        {!completed ? (
          <Row center gap={14}>
            <Icon size={20} name="post.rapid" color={Colors.text}></Icon>
            <Text style={[text.l, text.semiBold, text.center]}>
              {vote.option}
            </Text>
          </Row>
        ) : (
          <Row spaceBetween alignCenter style={{paddingHorizontal: 12}}>
            <Text style={[text.l, text.bold]}>{vote.amount}</Text>
            <Text style={[text.m, text.semiBold]}>{vote.option}</Text>
          </Row>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  vote: {
    height: 50,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: Colors.textSecondary,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  absoluteContainer: {
    position: 'absolute',
    alignSelf: 'flex-start',
    zIndex: 1,
    borderWidth: 0,
    backgroundColor: Colors.primary,
  },
  completed: {
    backgroundColor: Colors.dark,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    position: 'absolute',
    zIndex: 1000,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryTransparent,
    height: '100%',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
});
