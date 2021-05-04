//React import
import React, {useState, useEffect} from 'react';
//End of React import

//UI components import
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import Paragraph from '../components/Paragraph';
import {theme} from '../core/theme';
import Loader from '../components/Loader';
//End of UI components import

//GraphQL Client import
import {useMutation} from '@apollo/client';
import {REQUEST_LOGIN} from '../graphql/mutations/authentication/login';
import {LOGIN} from '../context/userContext';
//End of GraphQL Client import

//React Context import
import {useAuth} from '../context/userContext';
//End of React Context import

//Validator utils import
import {emailValidator, passwordValidator} from '../core/utils';
//End of Validator utils import

const LoginScreen = ({navigation}) => {
  //Core States declaration
  const {state, dispatch} = useAuth();
  const [accountValues, setAccountValues] = useState({
    username: '',
    password: '',
  });
  const [errorText, setErrorText] = useState('');
  const [emailErrorText, setEmailErrorText] = useState('');
  const [passwordErrorText, setPasswordErrorText] = useState('');
  //End of Core States declaration

  //Core GraphQL Mutations declaration
  const [requestLoginMutation, {loading: requestLoginLoading}] = useMutation(
    REQUEST_LOGIN,
    {
      update(proxy, {data: userData}) {
        console.log(accountValues)
        dispatch({type: LOGIN, payload: userData.login});
      },
      variables: accountValues,
    },
  );
  //End of Core GraphQL Mutations declaration

  //Core State handlers declaration
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
      setAccountValues({
        username: '',
        password: '',
      });
      navigation.navigate('Families');
    } catch (error) {
      console.log(error);
      setErrorText('Incorrect Username or Password! Please check again.');
      setAccountValues((previousState) => {
        return {
          ...previousState,
          password: '',
        };
      });
    }
  };
  //End of Core State handlers declaration

  //useEffect Hook to prevent goBackToPreviousScreen action
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
  }, [navigation]);
  //End of useEffect Hook to prevent goBackToPreviousScreen action

  //Core Component return
  return (
    <Background>
      <Loader loading={requestLoginLoading} />
      <Logo />

      <Header>Login</Header>
      <Paragraph color={theme.colors.error}>{errorText}</Paragraph>
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
  //End of Core Component return
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
