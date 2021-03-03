import React, {useState, createRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import {useMutation} from '@apollo/client';
import {REQUEST_REGISTER} from '../graphql/mutations/authentication/register';
import {useAuth,REGISTER} from '../context/userContext';
import Loader from '../components/Loader';
import {emailValidator, passwordValidator, nameValidator} from '../core/utils';
import Paragraph from '../components/Paragraph';
const RegisterScreen = ({navigation}) => {
  const {state, dispatch} = useAuth();
    
  const [accountValues, setAccountValues] = useState({
    name: '',
    email:'',
    password: '',
    password_confirmation:''
  });

  const [errorText, setErrorText] = useState('');
  const [emailErrorText, setEmailErrorText] = useState('')
  const [nameErrorText, setNameErrorText] = useState('')
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [passwordConfirmErrorText, setPasswordConfirmErrorText] = useState('')

  const [requestRegisterMutation, {loading: requestRegisterLoading}] = useMutation(
    REQUEST_REGISTER,
    {
      update(proxy, {data: userData}) {
        dispatch({type: REGISTER, payload: userData.register.tokens});
      },
      variables: accountValues,
    },
  );

  const handleUsernameChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, name: event};
    });
  };

  const handleEmailChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, email: event};
    });
  };

  const handlePasswordChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, password: event};
    });
  };

  const handlePasswordConfirmChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, password_confirmation: event};
    });
  };

  const requestRegister = async () => {
    const nameError = nameValidator(accountValues.name);
    const emailError = emailValidator(accountValues.email);
    const passwordError = passwordValidator(accountValues.password);
    
    if(nameError){
      return setNameErrorText(nameError);
    }
    if (emailError) {
      return setEmailErrorText(emailError);
    }
    if (passwordError) {
      return setPasswordErrorText(passwordError);
    }
    if (accountValues.password_confirmation!==accountValues.password) {
      return setPasswordConfirmText('Oops, your Password & Password Confirm are not the same!');
    }
    try {
      await requestRegisterMutation();
      navigation.navigate('Families');
    } catch (error) {
      console.log(error.message);
      setErrorText('Sorry! This account has been registered before.');
    }
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('LoginScreen')} />
        <Loader loading={requestRegisterLoading} />

      <Logo />

      <Header>Create Account</Header>
      <Paragraph color={theme.colors.error}>
          {errorText}
        </Paragraph>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={accountValues.name}
        onChangeText={handleUsernameChange}
        error={nameErrorText!==''}
        errorText={nameErrorText}
      />

      <TextInput
        label="Email"
        returnKeyType="next"
        value={accountValues.email}
        onChangeText={handleEmailChange}
        error={emailErrorText!==''}
        errorText={emailErrorText}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="next"
        value={accountValues.password}
        onChangeText={handlePasswordChange}
        error={passwordErrorText!==''}
        errorText={passwordErrorText}
        secureTextEntry
      />
      <TextInput
        label="Password Confirm"
        returnKeyType="done"
        value={accountValues.password_confirmation}
        onChangeText={handlePasswordConfirmChange}
        error={passwordConfirmErrorText!==''}
        errorText={passwordConfirmErrorText}
        secureTextEntry
      />

      <Button mode="contained" onPress={requestRegister} style={styles.button}>
        Sign Up
      </Button>

    </Background>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
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