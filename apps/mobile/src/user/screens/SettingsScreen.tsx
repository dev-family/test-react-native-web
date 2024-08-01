import {ScrollView, StyleSheet, View} from 'react-native';
import {global} from '../../../assets/styles/global';
import {useScreenInsets} from '../../ui/constants/insets';
import {Header} from '../../ui/components';
import React from 'react';
import {
  ProfileRoutes,
  ProfileStackScreenProps,
} from '../../ui/navigation/types';
import {ProfileOptions} from '../components/ProfileOptions';
import {Colors} from '../../ui/constants/colors';
import {useAuthStore} from '../../auth/store';

export const SettingsScreen: React.FC<
  ProfileStackScreenProps<ProfileRoutes.SETTINGS>
> = ({navigation}) => {
  const {
    insetsTopHeader: paddingTop,
    insetsTabBar: paddingBottom,
    insetsHorizontal: paddingHorizontal,
  } = useScreenInsets();

  const {logout} = useAuthStore();
  return (
    <View style={[global.screen]}>
      <ScrollView
        style={global.flex}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          global.scrollContent,
          {paddingTop: paddingTop + 20, paddingBottom, paddingHorizontal},
          styles.content,
        ]}>
        <ProfileOptions
          options={[{title: 'Coins', icon: 'coin', iconColor: Colors.yellow}]}
        />
        <ProfileOptions
          options={[
            {title: 'Notifications', icon: 'bell', iconColor: Colors.blue},
            {title: 'Language', icon: 'language', iconColor: Colors.purple},
            {title: 'Boost', icon: 'flashlight', iconColor: Colors.orange},
          ]}
        />

        <ProfileOptions
          style={styles.logout}
          options={[
            {
              title: 'Log Out',
              destructive: true,
              withChevron: false,
              iconColor: Colors.red,
              icon: 'logout',
              onPress: logout,
            },
          ]}
        />
      </ScrollView>
      <Header
        title="Settings"
        leftIcon="chevron-left"
        leftText="Back"
        onLeftPress={navigation.goBack}></Header>
    </View>
  );
};

const styles = StyleSheet.create({
  logout: {
    marginTop: 'auto',
  },
  content: {
    gap: 24,
  },
});
