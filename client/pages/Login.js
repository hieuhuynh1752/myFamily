import React from 'react';
import {Container, Button, Content, Form, Item, Input, Text} from 'native-base';
import {useMutation} from '@apollo/client';
import {REQUEST_LOGIN} from '../graphql/mutations/authentication/login';
import {UserContext} from '../context/userContext';
import {useContext} from 'react';
import {useState} from 'react/cjs/react.development';

/* TYPES */
export const LOGIN = "LOGIN";
/* END */

const Login = (props) => {
  const {state, dispatch} = useContext(UserContext);
  console.log(state);
  const [accountValues, setAccountValues] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    usernameError: false,
    passwordError: false,
  });

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
    setAccountValues((previousState) => {
      return {...previousState, username: event};
    });
  };

  const handlePasswordChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, password: event};
    });
  };

  const requestLogin = async () => {
    if (accountValues.username === '') {
      return setErrors((previousState) => {
        return {
          ...previousState,
          usernameError: true,
        };
      });
    }
    setErrors((previousState) => {
      return {
        ...previousState,
        usernameError: false,
      };
    });
    if (accountValues.password === '') {
      return setErrors((previousState) => {
        return {
          ...previousState,
          passwordError: true,
        };
      });
    }
    setErrors((previousState) => {
      return {
        ...previousState,
        usernameError: true,
      };
    });
    try {
      await requestLoginMutation();
      console.log(accountValues);
      //return props.screenProps.changeLoginState(true)
    } catch (error) {
      //   if (/username/i.test(e.message)) {
      //       this.setState({ usernameError: true });
      //     }
      //     if (/password/i.test(e.message)) {
      //       this.setState({ passwordError: true });
      //     }
      // }
      console.log(error.message);
    }
  };

  return (
    <Container>
      <Content>
        <Form>
          <Item error={errors.usernameError}>
            <Input
              placeholder="Email"
              onChangeText={handleUsernameChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Item>
          <Item error={errors.passwordError}>
            <Input
              placeholder="Password"
              onChangeText={handlePasswordChange}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
          </Item>
        </Form>
        <Button full onPress={requestLogin} disabled={requestLoginLoading}>
          <Text>Sign In</Text>
        </Button>
      </Content>
    </Container>
  );
};

export default Login;
