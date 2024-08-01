import {ScrollView, StyleSheet, View} from 'react-native';
import {global} from '../../../assets/styles/global';
import {Button, Header, TextInput} from '../../ui/components';
import {useScreenInsets} from '../../ui/constants/insets';
import {FormikHelpers, useFormik} from 'formik';
import {useAuthStore} from '../store';
import React from 'react';
import {AuthRoutes, AuthStackScreenProps} from '../../ui/navigation/types';

export const SignUpScreen: React.FC<
  AuthStackScreenProps<AuthRoutes.SIGN_UP>
> = ({navigation}) => {
  const {insetsTopHeader, insetsBottom} = useScreenInsets();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const {register, loading, setLoading} = useAuthStore();

  const onSubmit = async (
    form: typeof initialValues,
    {setFieldError}: FormikHelpers<typeof initialValues>,
  ) => {
    if (Object.values(form).some(i => !i)) {
      return;
    }
    if (form.confirmPassword !== form.password) {
      setFieldError('confirmPassword', 'Passwords must be equal');
      return;
    }
    const result = await register(form);
    if (result.errors) {
      result.errors.map(error => {
        setFieldError(error.field, error.message);
      });
    }
  };

  const {values, errors, handleChange, handleSubmit} = useFormik({
    initialValues,
    onSubmit,
  });

  const disabled = Object.values(values).some(i => !i);

  return (
    <View style={global.screen}>
      <Header
        title="Sign Up"
        leftIcon="chevron-left"
        leftText="Back"
        onLeftPress={() => navigation.goBack()}></Header>
      <ScrollView
        style={global.screen}
        contentContainerStyle={[
          {
            paddingTop: insetsTopHeader,
          },
          styles.content,
          global.paddingHorizontal,
        ]}>
        <View style={[styles.form, {paddingBottom: insetsBottom}]}>
          <TextInput
            value={values.username}
            label="Username *"
            placeholder="Enter your username..."
            onChangeText={handleChange('username')}
            error={errors.username}
          />
          <TextInput
            value={values.email}
            label="Email *"
            placeholder="Enter your email..."
            onChangeText={handleChange('email')}
            autoCapitalize="none"
            error={errors.email}
          />
          <TextInput
            label="Password *"
            password
            placeholder="Enter your password..."
            value={values.password}
            onChangeText={handleChange('password')}
            error={errors.password}
          />
          <TextInput
            label="Confirm Password *"
            password
            placeholder="Confirm your password..."
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            error={errors.confirmPassword}
          />
          <Button
            loading={loading}
            onPress={handleSubmit}
            style={styles.button}
            disabled={disabled}>
            Create an Account
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  form: {
    flex: 1,
    gap: 12,
    paddingTop: 30,
  },
  button: {
    marginTop: 'auto',
  },
});
