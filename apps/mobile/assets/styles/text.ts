import {StyleSheet} from 'react-native';
import {Colors} from '../../src/ui/constants/colors';

export const text = StyleSheet.create({
  xs: {fontSize: 10, lineHeight: 12, color: Colors.text},
  s: {
    fontSize: 12,
    lineHeight: 14,
    color: Colors.text,
  },
  m: {
    fontSize: 14,
    lineHeight: 16,
    color: Colors.text,
  },
  l: {
    fontSize: 16,
    lineHeight: 18,
    color: Colors.text,
  },
  title: {fontSize: 17, lineHeight: 20, color: Colors.text},
  xl: {fontSize: 18, lineHeight: 20, color: Colors.text},

  xxl: {fontSize: 20, lineHeight: 22, color: Colors.text},
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  center: {
    textAlign: 'center',
  },
  medium: {
    fontWeight: '500',
  },
  semiBold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  white: {
    color: Colors.dark,
  },
  secondary: {
    color: Colors.textSecondary,
  },
  tertiary: {
    color: Colors.tertiary,
  },
  green: {
    color: Colors.green,
  },
  red: {
    color: Colors.red,
  },
  primary: {
    color: Colors.primary,
  },
});
