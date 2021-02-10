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
const RegisterScreen = ({navigation}) => {
  const {state, dispatch} = useAuth();
    
  const [accountValues, setAccountValues] = useState({
    name: '',
    email:'',
    password: '',
    password_confirmation:''
  });

  const [errorText, setErrorText] = useState({text: '', type: ''});

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
    const emailError = emailValidator(accountValues.username);
    const passwordError = passwordValidator(accountValues.password);
    
    if(nameError){
      setErrorText({
        text:nameError, type:'name'
      })
    }
    if (emailError) {
      setErrorText({
        text:emailError, type:'email'});
    }
    if (passwordError) {
      setErrorText({text:passwordError, type:'password'});
    }
    if (accountValues.password_confirmation!==accountValues.password) {
      setErrorText({text:'Oops, your Password & Password Confirm are not the same!', type:'password_confirm'});
    }
    try {
      await requestRegisterMutation();
      navigation.navigate('Home');
    } catch (error) {
      console.log(error.message);
      setErrorText({text:'This account has been registered before.', type:'account_exist'});
    }
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('LoginScreen')} />
        <Loader loading={requestRegisterLoading} />

      <Logo />

      <Header>Create Account</Header>

      <TextInput
        label="Name"
        returnKeyType="next"
        value={accountValues.name}
        onChangeText={handleUsernameChange}
        error={errorText.type==='name'}
        errorText={errorText.text}
      />

      <TextInput
        label="Email"
        returnKeyType="next"
        value={accountValues.email}
        onChangeText={handleEmailChange}
        error={errorText.type==='email'}
        errorText={errorText.text}
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
        error={errorText.type==='password'}
        errorText={errorText.text}
        secureTextEntry
      />
      <TextInput
        label="Password Confirm"
        returnKeyType="done"
        value={accountValues.password_confirmation}
        onChangeText={handlePasswordConfirmChange}
        error={errorText.type==='password_confirm'}
        errorText={errorText.text}
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