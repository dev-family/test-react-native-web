import React from 'react';
import {StatusBar, View} from 'react-native';
import {global} from './assets/styles/global';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './src/ui/navigation';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {Colors} from './src/ui/constants/colors';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MessageProvider, WSProvider} from './src/lib';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={global.screen}>
        <StatusBar
          backgroundColor={Colors.background}
          barStyle="light-content"
        />
        <WSProvider>
          <SafeAreaProvider>
            <MessageProvider>
              <NavigationContainer
                theme={{
                  ...DefaultTheme,
                  colors: {...DefaultTheme.colors, background: Colors.dark},
                }}>
                <RootNavigator />
              </NavigationContainer>
            </MessageProvider>
          </SafeAreaProvider>
        </WSProvider>
      </View>
    </GestureHandlerRootView>
  );
}
