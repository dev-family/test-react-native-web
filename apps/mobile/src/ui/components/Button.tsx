import {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {text} from '../../../assets/styles/text';
import {Colors} from '../constants/colors';

type ButtonProps = {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
};
export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  style,
  loading,
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[styles.container, disabled && styles.disabled, style]}>
      {loading ? (
        <ActivityIndicator color={Colors.text}></ActivityIndicator>
      ) : (
        <Text style={text.button}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 55,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
});
