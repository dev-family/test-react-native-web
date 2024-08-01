import React from 'react';
import {TextInput, TextInputProps, StyleSheet} from 'react-native';
import {Colors} from '../../ui/constants/colors';

export const ProfileInput: React.FC<TextInputProps> = ({style, ...props}) => {
  return (
    <TextInput
      style={[styles.profileInput, style]}
      placeholderTextColor={Colors.textSecondary}
      selectionColor={Colors.primary}
      cursorColor={Colors.primaryTransparent}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  profileInput: {
    padding: 0,
    margin: 0,
    height: 30,
    backgroundColor: Colors.dark,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: Colors.text,
    minWidth: 40,
  },
});
