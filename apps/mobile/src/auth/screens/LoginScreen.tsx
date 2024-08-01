import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {global} from '../../../assets/styles/global';
import {Button, Header, TextInput} from '../../ui/components';
import {useScreenInsets} from '../../ui/constants/insets';
import {text} from '../../../assets/styles/text';
import {AuthRoutes, AuthStackScreenProps} from '../../ui/navigation/types';
import {Colors} from '../../ui/constants/colors';
import React from 'react';
import {useAuthStore} from '../store';
import {FormikHelpers, useFormik} from 'formik';
import {AxiosError} from 'axios';

export const LoginScreen: React.FC<AuthStackScreenProps<AuthRoutes.LOGIN>> = ({
  navigation,
}) => {
  const {insetsBottom, insetsTopHeader} = useScreenInsets();
  const {loading, login} = useAuthStore();

  const initialValues = {
    username: '',
    password: '',
  };

  const onSubmit = async (
    form: typeof initialValues,
    {setErrors}: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      if (Object.values(form).some(v => !v)) {
        return;
      }
      await login(form);
    } catch (error) {
      const e = error as AxiosError<{error: string}>;
      if (e.response?.data.error) {
        setErrors({
          username: e.response.data.error,
          password: e.response.data.error,
        });
      }
    }
  };

  const {handleChange, handleSubmit, values, errors} = useFormik({
    initialValues,
    onSubmit,
  });

  const createAccount = () => {
    navigation.navigate(AuthRoutes.SIGN_UP);
  };

  const disabled = Object.values(values).some(i => !i);
  return (
    <View style={global.screen}>
      <Header title="Log In"></Header>
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
            label="Username *"
            placeholder="Enter username..."
            value={values.username}
            onChangeText={handleChange('username')}
            error={errors.username}
          />
          <TextInput
            label="Password *"
            password
            placeholder="Enter password..."
            value={values.password}
            onChangeText={handleChange('password')}
            error={errors.username}
          />
          <View style={styles.bottom}>
            <Button
              disabled={disabled}
              loading={loading}
              onPress={handleSubmit}>
              Let's go!
            </Button>
            <TouchableOpacity onPress={createAccount}>
              <Text style={[text.m, text.center]}>
                Don't have an account?{' '}
                <Text style={[text.m, styles.text]}>Create a new one</Text>
              </Text>
            </TouchableOpacity>
          </View>
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
  bottom: {
    marginTop: 'auto',
    gap: 10,
  },
  text: {
    color: Colors.primary,
    fontWeight: '500',
  },
});
