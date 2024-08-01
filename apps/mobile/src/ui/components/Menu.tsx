import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  View,
} from 'react-native';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {Layout} from '../constants/insets';
import {Colors} from '../constants/colors';
import {BlurView} from 'expo-blur';
import {IconsType} from '../constants/icons';
import {Row} from './Row';
import {text} from '../../../assets/styles/text';
import {Icon} from './Icon';

export type MenuAction = {
  id: string;
  title: string;
  icon: IconsType;
  destructive?: boolean;
  onPress?: () => void;
  color?: string;
};

type MenuProps = {
  actions: MenuAction[];
  title?: string;
  style?: StyleProp<ViewStyle>;
  type?: 'dark' | 'light';
};

const Action: React.FC<{action: MenuAction; borderBottom?: boolean}> = ({
  action,
  borderBottom,
}) => {
  const {color, destructive} = action;
  return (
    <TouchableOpacity onPress={action.onPress}>
      <Row
        alignCenter
        spaceBetween
        style={[styles.action, borderBottom && styles.borderBottom]}>
        <Text
          style={[
            text.m,
            !!color && {color},
            destructive && {color: Colors.red},
          ]}>
          {action.title}
        </Text>
        <Icon
          name={action.icon}
          size={20}
          color={destructive ? Colors.red : color ? color : Colors.text}
        />
      </Row>
    </TouchableOpacity>
  );
};

export const Menu: React.FC<MenuProps> = React.memo(
  ({style, actions, title, type = 'dark'}) => {
    return (
      <Animated.View
        entering={Platform.OS === 'web' ? undefined : ZoomIn}
        exiting={Platform.OS === 'web' ? undefined : ZoomOut}
        style={style}>
        <BlurView tint={type} intensity={80} style={styles.container}>
          {!!title && (
            <View style={styles.title}>
              <Text style={[text.center, text.xs, text.tertiary]}>{title}</Text>
            </View>
          )}
          {actions.map((action, index, arr) => (
            <Action
              key={action.id}
              action={action}
              borderBottom={index < arr.length - 1}
            />
          ))}
        </BlurView>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: Layout.width / 2,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  title: {
    height: 25,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  action: {
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  borderBottom: {borderBottomWidth: 1},
});
