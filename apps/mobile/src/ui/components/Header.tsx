import {BlurView} from 'expo-blur';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useScreenInsets} from '../constants/insets';
import {Row} from './Row';
import React, {PropsWithChildren} from 'react';
import {text} from '../../../assets/styles/text';
import {Colors} from '../constants/colors';
import {IconsType} from '../constants/icons';
import {Icon} from './Icon';

type HeaderProps = {
  title: string;
  onRightPress?: () => void;
  onLeftPress?: () => void;
  leftText?: string;
  leftIcon?: IconsType;
  rightText?: string;
  rightIcon?: IconsType;
  insetsTop?: boolean;
};
export const Header: React.FC<PropsWithChildren<HeaderProps>> = ({
  children,
  title,
  leftIcon,
  leftText,
  rightIcon,
  rightText,
  onRightPress,
  onLeftPress,
  insetsTop = true,
}) => {
  const insets = useScreenInsets();
  return (
    <BlurView
      tint="dark"
      intensity={80}
      style={[
        {
          paddingTop: insetsTop ? insets.insetsTop : 10,
        },
        styles.container,
      ]}>
      <Row
        alignCenter
        spaceBetween
        style={{height: insets.headerHeight, paddingHorizontal: 10}}>
        <TouchableOpacity
          activeOpacity={onLeftPress ? 0.5 : 1}
          onPress={onLeftPress}
          style={styles.icon}>
          {leftIcon && (
            <Icon color={Colors.text} name={leftIcon} size={23}></Icon>
          )}
          {leftText && <Text style={[text.l, text.medium]}>{leftText}</Text>}
        </TouchableOpacity>
        <Text style={[text.title, text.semiBold, text.primary]}>{title}</Text>
        <TouchableOpacity
          activeOpacity={onRightPress ? 0.5 : 1}
          onPress={onRightPress}
          style={[styles.icon, {justifyContent: 'flex-end'}]}>
          {rightText && <Text style={[text.l, text.medium]}>{rightText}</Text>}
          {rightIcon && (
            <Icon name={rightIcon} color={Colors.text} size={23}></Icon>
          )}
        </TouchableOpacity>
      </Row>
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1111111,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  icon: {
    height: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 3,
  },
});