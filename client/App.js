import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';

import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
  ApolloProvider,
} from '@apollo/client';

import {signIn, signOut, getToken} from './util';

const authenticationMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(async (req, {headers}) => {
    const token = await getToken();

    return {
      ...headers,
      headers: {
        authorization: token ? `Bearer ${token}` : null,
      },
    };
  });
  return forward(operation);
});

const httpLink = createHttpLink({
  uri: process.env.API_URL,
});

const link = from([authenticationMiddleware, httpLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

const AuthStack = createStackNavigator({
  Register: {screen: Register, navigationOptions: {headerTitle: 'Register'}},
  Login: {screen: Login, navigationOptions: {headerTitle: 'Login'}},
});

const LoggedInStack = createStackNavigator({
  Profile: {screen: Profile, navigationOptions: {headerTitle: 'Profile'}},
});

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const token = await getToken();
  if (token) {
    setLoggedIn(true);
  }

  const handleChangeLoginState = (loggedIn = false, jwt) => {
    setLoggedIn(loggedIn);
    if (loggedIn) {
      signIn(jwt);
    } else {
      signOut();
    }
  };

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        {isLoggedIn ? (
          <LoggedInStack
            screenProps={{changeLoginState: handleChangeLoginState}}
          />
        ) : (
          <AuthStack screenProps={{changeLoginState: handleChangeLoginState}} />
        )}
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
