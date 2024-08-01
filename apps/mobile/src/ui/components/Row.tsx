import React from 'react';

import type {StyleProp, ViewProps, ViewStyle} from 'react-native';
import Animated, {AnimatedProps} from 'react-native-reanimated';

type RowProps = {
  alignCenter?: boolean;
  alignStart?: boolean;
  style?: StyleProp<ViewStyle>;
  wrap?: boolean;
  spaceBetween?: boolean;
  center?: boolean;
  gap?: number;
} & AnimatedProps<ViewProps>;

export const Row: React.FC<RowProps> = ({
  children,
  alignCenter,
  alignStart,
  style,
  wrap,
  spaceBetween,
  center,
  gap = 0,
  ...props
}) => (
  <Animated.View
    entering={props.entering}
    style={[
      {flexDirection: 'row'},
      alignCenter && {alignItems: 'center'},
      alignStart && {alignItems: 'flex-start'},
      wrap && {flexWrap: 'wrap'},
      spaceBetween && {justifyContent: 'space-between'},
      center && {justifyContent: 'center'},
      {gap},
      style,
    ]}
    {...props}>
    {children}
  </Animated.View>
);
