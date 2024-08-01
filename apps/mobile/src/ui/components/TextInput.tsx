import React, {useState} from 'react';
import {
  TextInput as BaseInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {text} from '../../../assets/styles/text';
import {global} from '../../../assets/styles/global';
import {Colors} from '../constants/colors';
import type {
  TextInputProps as BaseInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {Easing, LinearTransition} from 'react-native-reanimated';

export type TextInputProps = {
  label?: string;
  password?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
} & BaseInputProps;

export const TextInput: React.FC<TextInputProps> = ({
  label,
  style,
  password,
  containerStyle,
  error,
  ...props
}) => {
  const [hidden, setHidden] = useState(password ? true : undefined);

  return (
    <Animated.View
      layout={LinearTransition.easing(Easing.linear)}
      style={[styles.container, containerStyle]}>
      {!!label && <Text style={[text.m, styles.label]}>{label}</Text>}
      <Animated.View
        layout={LinearTransition.easing(Easing.linear)}
        style={[styles.inputContainer, global.row]}>
        <BaseInput
          selectionColor={Colors.primary}
          cursorColor={Colors.primaryTransparent}
          style={[styles.input, text.l, style]}
          placeholderTextColor={'#848484'}
          secureTextEntry={hidden}
          {...props}
        />
        {password && (
          <TouchableOpacity onPress={() => setHidden(!hidden)}>
            <Text style={[text.m, styles.label, styles.primaryColor]}>
              {hidden ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      {!!error && <Text style={[text.s, text.red]}>{error}</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontWeight: '500',
  },
  inputContainer: {
    height: 50,
    borderWidth: 1.5,
    padding: 0,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: Colors.dark,
  },
  input: {
    padding: 0,
    height: '100%',
    flex: 1,
  },
  primaryColor: {
    color: Colors.primary,
  },
});
