import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useMutation} from '@apollo/client';
import {REQUEST_LOGIN} from '../graphql/mutations/authentication/login';
import {useAuth} from '../context/userContext';
import {LOGIN} from '../context/userContext';
import Loader from '../components/Loader';
//import {useTheme, TextInput} from 'react-native-paper';

import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import Paragraph from '../components/Paragraph';

import {theme} from '../core/theme';

import {emailValidator, passwordValidator} from '../core/utils';

const LoginScreen = ({navigation}) => {
  const {state, dispatch} = useAuth();
  const [accountValues, setAccountValues] = useState({
    username: '',
    password: '',
  });
  const [errorText, setErrorText] = useState('');
  const [emailErrorText, setEmailErrorText] = useState('');
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [requestLoginMutation, {loading: requestLoginLoading}] = useMutation(
    REQUEST_LOGIN,
    {
      update(proxy, {data: userData}) {
        dispatch({type: LOGIN, payload: userData.login});
      },
      variables: accountValues,
    },
  );

  const handleUsernameChange = (event) => {
    setEmailErrorText('');
    setAccountValues((previousState) => {
      return {...previousState, username: event};
    });
  };

  const handlePasswordChange = (event) => {
    setPasswordErrorText('');
    setAccountValues((previousState) => {
      return {...previousState, password: event};
    });
  };

  const requestLogin = async () => {
    const emailError = emailValidator(accountValues.username);
    const passwordError = passwordValidator(accountValues.password);
    if (emailError) {
      return setEmailErrorText(emailError);
    }
    if (passwordError) {
      return setPasswordErrorText(passwordError);
    }
    try {
      await requestLoginMutation();
      navigation.navigate('Families');
    } catch (error) {
      console.log(error);
      setErrorText('Incorrect Username or Password! Please check again.');
      setAccountValues((previousState)=>{
        return{
          ...previousState, password:''
        }
      })
    }
  };

  return (
    <Background>
      <Loader loading={requestLoginLoading} />
      <Logo />

      <Header>Login</Header>
        <Paragraph color={theme.colors.error}>
          {errorText}
        </Paragraph>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={accountValues.username}
        onChangeText={handleUsernameChange}
        error={emailErrorText !== ''}
        errorText={emailErrorText}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={accountValues.password}
        onChangeText={handlePasswordChange}
        error={passwordErrorText !== ''}
        errorText={passwordErrorText}
        secureTextEntry
      />

      {/* NEED TO TEST
       <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}

      <Button
        mode="contained"
        color={theme.colors.surface}
        onPress={requestLogin}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
