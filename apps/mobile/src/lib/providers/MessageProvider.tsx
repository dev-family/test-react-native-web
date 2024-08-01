import React, {PropsWithChildren, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useScreenInsets} from '../../ui/constants/insets';
import {Icon} from '../../ui/components';
import {Colors} from '../../ui/constants';
import {text} from '../../../assets/styles/text';
import {global} from '../../../assets/styles/global';
import Animated, {SlideInUp, SlideOutUp} from 'react-native-reanimated';

type Message = {
  text: string;
  type: 'success' | 'failure';
};

type ContextType = {
  message: Message | undefined;
  showMessage: (message: Message, delay?: number) => void;
  removeMessage: () => void;
};

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
const MessageContext = React.createContext({} as ContextType);

export const MessageProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [message, setMessage] = useState<Message | undefined>(undefined);

  const {insetsTop} = useScreenInsets();

  return (
    <MessageContext.Provider
      value={{
        message,

        showMessage: (data, delay = 9000) => {
          setMessage(data);
          setTimeout(() => {
            setMessage(undefined);
          }, delay);
        },

        removeMessage: () => {
          setMessage(undefined);
        },
      }}>
      {message && (
        <AnimatedButton
          activeOpacity={0.9}
          onPress={() => setMessage(undefined)}
          entering={Platform.OS === 'web' ? undefined : SlideInUp}
          exiting={Platform.OS === 'web' ? undefined : SlideOutUp}
          style={[styles.message, {top: insetsTop}]}>
          <Icon
            name={message.type === 'failure' ? 'cross' : 'check'}
            color={Colors.text}
            size={20}
            containerStyle={[
              styles.icon,
              {
                backgroundColor:
                  message.type === 'failure' ? Colors.red : Colors.green,
              },
            ]}
          />
          <Text style={[text.m, text.medium, global.flex]}>{message.text}</Text>
        </AnimatedButton>
      )}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => React.useContext(MessageContext);

const styles = StyleSheet.create({
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'absolute',
    zIndex: 99999,
    right: 10,
    left: 10,
    height: 50,
    backgroundColor: Colors.dark,
    borderRadius: 15,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    height: 30,
    width: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
