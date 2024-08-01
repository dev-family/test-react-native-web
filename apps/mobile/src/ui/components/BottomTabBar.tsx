import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {BlurView} from 'expo-blur';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useScreenInsets} from '../constants/insets';
import {Colors} from '../constants/colors';
import {Row} from './Row';
import {Icon} from './Icon';
import {IconsType} from '../constants/icons';
import {text} from '../../../assets/styles/text';

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  navigation,
  state,
}) => {
  const {insetsBottom, tabBarHeight} = useScreenInsets();

  return (
    <BlurView
      tint="dark"
      intensity={100}
      style={[styles.tabBar, {paddingBottom: insetsBottom}]}>
      <Row
        alignCenter
        spaceBetween
        style={{height: tabBarHeight, marginTop: 10}}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const {key, name} = route;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onPress}
              onLongPress={onLongPress}
              key={key}
              style={styles.item}>
              {isFocused ? (
                <Icon
                  name={`tabs.${name.toLowerCase()}` as IconsType}
                  size={26}
                  color={Colors.primary}
                />
              ) : (
                <Icon
                  name={`tabs.${name.toLowerCase()}` as IconsType}
                  size={26}
                  color={Colors.textSecondary}
                />
              )}
              <Text
                style={[
                  text.s,
                  text.center,
                  isFocused ? text.primary : text.secondary,
                ]}>
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Row>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    zIndex: 99999,
    bottom: 0,
    right: 0,
    left: 0,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    zIndex: 99999999,
  },
});
