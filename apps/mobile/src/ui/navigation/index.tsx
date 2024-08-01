import React from 'react';
import {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthNavigator} from './AuthNavigator';
import {useAuthStore} from '../../auth/store';
import {AppNavigator} from './AppNavigator';
import {usePostStore} from '../../posts/store';
import {useUserStore} from '../../user/store';

const RootStack = createNativeStackNavigator();

enum RootRoutes {
  AUTH = 'Auth',
  APP = 'App',
}

export const RootNavigator = () => {
  const {token} = useAuthStore();

  const {getPosts, getTags} = usePostStore();
  const {get: getUser} = useUserStore();


  useEffect(() => {
    if (token) {
      getPosts({page: '1'});
      getTags();
      getUser();
    }
  }, [token]);

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {token ? (
        <RootStack.Screen name={RootRoutes.APP} component={AppNavigator} />
      ) : (
        <RootStack.Screen name={RootRoutes.AUTH} component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};
