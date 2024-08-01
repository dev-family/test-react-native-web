import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SignUpScreen, LoginScreen} from '../../auth';
import {AuthRoutes, AuthStackParamList} from './types';
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name={AuthRoutes.LOGIN} component={LoginScreen} />
      <AuthStack.Screen name={AuthRoutes.SIGN_UP} component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};
