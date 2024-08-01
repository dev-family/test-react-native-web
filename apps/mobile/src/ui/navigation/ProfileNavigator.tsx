import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileRoutes, ProfileStackParamList} from './types';
import {ProfileScreen, SettingsScreen} from '../../user';

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen
        name={ProfileRoutes.PROFILE}
        component={ProfileScreen}
      />
      <ProfileStack.Screen
        name={ProfileRoutes.SETTINGS}
        component={SettingsScreen}
      />
    </ProfileStack.Navigator>
  );
};
