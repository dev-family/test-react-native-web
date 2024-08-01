import {StyleSheet} from 'react-native';
import {Colors} from '../../src/ui/constants/colors';

export const global = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  paddingHorizontal: {
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {flexGrow: 1},
});
