import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {global} from '../../../assets/styles/global';
import {Layout, useScreenInsets} from '../../ui/constants/insets';
import {Header, Icon, Row} from '../../ui/components';
import {useUserStore} from '../../user/store';
import React from 'react';
import {
  ProfileRoutes,
  ProfileStackScreenProps,
} from '../../ui/navigation/types';
import {Colors} from '../../ui/constants/colors';
import {ProfileInput, ProfileOptions} from '../components';
import {useFormik} from 'formik';

export const ProfileScreen: React.FC<
  ProfileStackScreenProps<ProfileRoutes.PROFILE>
> = ({navigation}) => {
  const {user, update} = useUserStore();

  const {
    insetsTabBar: paddingBottom,
    insetsTopHeader,
    insetsHorizontal,
  } = useScreenInsets();
  const paddingTop = insetsTopHeader + 20;

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username,
    email: user?.email,
  };

  const onSubmit = async (form: typeof initialValues) => {
    await update(form);
  };

  const {values, handleChange, handleSubmit} = useFormik({
    initialValues,
    onSubmit,
  });

  const showSaveButton =
    (user?.lastName || '') !== values.lastName ||
    (user?.firstName || '') !== values?.firstName;

  return (
    <View style={global.screen}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom, paddingTop},
        ]}>
        <TouchableOpacity style={styles.image}>
          <Icon size={50} color={Colors.dark} name="profile-placeholder" />
        </TouchableOpacity>
        <View style={{paddingHorizontal: insetsHorizontal, gap: 12}}>
          <Row gap={12} style={{flex: 1, width: '100%'}}>
            <ProfileInput
              placeholder="First Name"
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              style={global.flex}
              autoComplete="cc-given-name"
            />
            <ProfileInput
              placeholder="Last Name"
              value={values.lastName}
              onChangeText={handleChange('lastName')}
              autoComplete="cc-family-name"
              style={[global.flex]}
            />
          </Row>
          <ProfileInput
            placeholder="Username*"
            value={values.username}
            onChangeText={handleChange('username')}
            editable={!user?.username}
          />
          <ProfileInput
            placeholder="Email*"
            value={values.email}
            onChangeText={handleChange('email')}
            editable={!user?.email}
            autoComplete="email"
          />
        </View>
        <ProfileOptions
          style={{marginHorizontal: insetsHorizontal}}
          options={[
            {
              title: 'Settings',
              icon: 'settings',
              iconColor: Colors.blue,
              onPress: () => navigation.navigate(ProfileRoutes.SETTINGS),
            },
            {
              title: `You have ${user?.balance} coins`,
              icon: 'coin',
              iconColor: Colors.yellow,
              onPress: () => navigation.navigate(ProfileRoutes.SETTINGS),
            },
          ]}
        />
      </ScrollView>
      <Header
        title={'Profile'}
        rightText={showSaveButton ? 'Save' : undefined}
        onRightPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: 24,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
