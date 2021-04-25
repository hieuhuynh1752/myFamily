//React import
import React, {useState} from 'react';
//End of React import

//UI components import
import {StyleSheet, ScrollView} from 'react-native';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import {theme} from '../core/theme';
import Loader from '../components/Loader';
import Paragraph from '../components/Paragraph';
//End of UI components import

//GraphQL Client import
import {useMutation} from '@apollo/client';
import {REQUEST_REGISTER} from '../graphql/mutations/authentication/register';
import {useAuth, REGISTER} from '../context/userContext';
//End of GraphQL Client import

//Validator utils import
import {emailValidator, passwordValidator, nameValidator} from '../core/utils';
//End of Validator utils import

const RegisterScreen = ({navigation}) => {
  //Core States declaration
  const {dispatch} = useAuth();

  const [accountValues, setAccountValues] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errorText, setErrorText] = useState('');
  const [emailErrorText, setEmailErrorText] = useState('');
  const [nameErrorText, setNameErrorText] = useState('');
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [passwordConfirmErrorText, setPasswordConfirmErrorText] = useState('');
  //End of Core States declaration

  //Core GraphQL Mutations declaration
  const [
    requestRegisterMutation,
    {loading: requestRegisterLoading},
  ] = useMutation(REQUEST_REGISTER, {
    update(proxy, {data: userData}) {
      dispatch({type: REGISTER, payload: userData.register.tokens});
    },
    variables: accountValues,
  });
  //Core GraphQL Mutations declaration

  //Core State handlers declaration
  const handleUsernameChange = (event) => {
    setNameErrorText('');
    setAccountValues((previousState) => {
      return {...previousState, name: event};
    });
  };

  const handleEmailChange = (event) => {
    setEmailErrorText('');
    setAccountValues((previousState) => {
      return {...previousState, email: event};
    });
  };

  const handlePasswordChange = (event) => {
    setPasswordErrorText('');
    setAccountValues((previousState) => {
      return {...previousState, password: event};
    });
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirmErrorText('');
    setAccountValues((previousState) => {
      return {...previousState, password_confirmation: event};
    });
  };

  const requestRegister = async () => {
    const nameError = nameValidator(accountValues.name);
    const emailError = emailValidator(accountValues.email);
    const passwordError = passwordValidator(accountValues.password);

    if (nameError) {
      return setNameErrorText(nameError);
    }
    if (emailError) {
      return setEmailErrorText(emailError);
    }
    if (passwordError) {
      return setPasswordErrorText(passwordError);
    }
    if (accountValues.password_confirmation !== accountValues.password) {
      return setPasswordConfirmErrorText(
        'Oops, your Password & Password Confirm are not the same!',
      );
    }
    try {
      await requestRegisterMutation();
      setAccountValues({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
      navigation.navigate('Families');
    } catch (error) {
      console.log(error.message);
      setErrorText('Sorry! This account has been registered before.');
    }
  };
  //End of Core State handlers declaration

  return (
    <ScrollView>
      <Background>
        <BackButton goBack={() => navigation.navigate('LoginScreen')} />
        <Loader loading={requestRegisterLoading} />
        <Header>Create Account</Header>
        <Paragraph color={theme.colors.error}>{errorText}</Paragraph>
        <TextInput
          label="Name"
          returnKeyType="next"
          value={accountValues.name}
          onChangeText={handleUsernameChange}
          error={nameErrorText !== ''}
          errorText={nameErrorText}
        />

        <TextInput
          label="Email"
          returnKeyType="next"
          value={accountValues.email}
          onChangeText={handleEmailChange}
          error={emailErrorText !== ''}
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
          error={passwordErrorText !== ''}
          errorText={passwordErrorText}
          secureTextEntry
        />
        <TextInput
          label="Password Confirm"
          returnKeyType="done"
          value={accountValues.password_confirmation}
          onChangeText={handlePasswordConfirmChange}
          error={passwordConfirmErrorText !== ''}
          errorText={passwordConfirmErrorText}
          secureTextEntry
        />
        <Button
          mode="contained"
          onPress={requestRegister}
          style={styles.button}>
          Sign Up
        </Button>
      </Background>
    </ScrollView>
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
