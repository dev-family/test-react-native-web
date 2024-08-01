import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Icon, Row} from '../../ui/components';
import React from 'react';
import {Colors} from '../../ui/constants/colors';
import {IconsType} from '../../ui/constants/icons';
import {text} from '../../../assets/styles/text';
import {global} from '../../../assets/styles/global';

export type ProfileItemProps = {
  withBorderBottom?: boolean;
  title?: string;
  icon?: IconsType;
  destructive?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  withChevron?: boolean;
  iconColor?: string;
};

export const ProfileItem: React.FC<ProfileItemProps> = ({
  withBorderBottom,
  title,
  icon,
  destructive,
  withChevron = true,
  onPress,
  onLongPress,
  iconColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.wrapper}>
      <Row gap={13} alignCenter style={[global.flex, styles.container]}>
        {icon && (
          <Icon
            name={icon}
            size={17}
            color={Colors.white}
            containerStyle={[
              styles.icon,
              !!iconColor && {backgroundColor: iconColor},
            ]}
          />
        )}
        <Row
          alignCenter
          spaceBetween
          style={[global.flex, withBorderBottom && styles.borderBottom]}>
          <Text
            style={[
              text.m,
              destructive && styles.destructive,
              destructive && text.medium,
            ]}>
            {title || 'Profile Item'}
          </Text>
          {withChevron && (
            <Icon
              color={destructive ? Colors.red : Colors.text}
              name="chevron-right"
              size={20}
            />
          )}
        </Row>
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {height: 38},

  container: {
    paddingHorizontal: 12,
  },
  borderBottom: {
    borderColor: Colors.border,
    borderBottomWidth: 1,
    height: 38,
  },
  destructive: {
    color: Colors.red,
  },
  icon: {
    height: 25,
    width: 25,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.text,
  },
});
