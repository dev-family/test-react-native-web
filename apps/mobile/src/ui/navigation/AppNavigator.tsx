import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppRoutes, AppStackParamList} from './types';
import {TabNavigator} from './TabNavigator';
import {PostScreen, AddPostScreen} from '../../posts';
import {Styles} from '../../lib/styles';
import {useScreenInsets} from '../constants/insets';


const AppStack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  const insets = useScreenInsets();
  Styles.init(insets);

  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen name={AppRoutes.TABS} component={TabNavigator} />
      <AppStack.Screen name={AppRoutes.POST} component={PostScreen} />
      <AppStack.Group screenOptions={{presentation: 'modal'}}>
        <AppStack.Screen name={AppRoutes.ADD_POST} component={AddPostScreen} />
      </AppStack.Group>
    </AppStack.Navigator>
  );
};
