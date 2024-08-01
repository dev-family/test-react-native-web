import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PostsScreen} from '../../posts';
import {TabRoutes, TabsStackParamList} from './types';
import {BottomTabBar} from '../components';
import {ProfileNavigator} from './ProfileNavigator';

const TabStack = createBottomTabNavigator<TabsStackParamList>();

export const TabNavigator = () => {
  return (
    <TabStack.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <TabStack.Screen name={TabRoutes.POSTS} component={PostsScreen} />
      <TabStack.Screen name={TabRoutes.PROFILE} component={ProfileNavigator} />
    </TabStack.Navigator>
  );
};
