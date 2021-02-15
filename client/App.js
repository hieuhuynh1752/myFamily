import React from 'react';
import {ApolloClient, InMemoryCache, from, HttpLink} from '@apollo/client';
import {ApolloProvider} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import Feather from 'react-native-vector-icons/Feather'
import {getToken} from './core/authenSetup';
import {onError} from '@apollo/client/link/error';
import {UserContextProvider} from './context/userContext';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import Navigator from './navigation/Navigator';
import {theme} from './core/theme';
import {API_URL} from '@env';

//apollo-setup
const httpLink = new HttpLink({uri: API_URL});
console.log(API_URL);
const authLink = setContext(async (req, {headers}) => {
  const token = await getToken();
  return {
    ...headers,
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const errors = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({message}) =>
      console.log(`[GraphQL error]: Message: ${message}`),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = from([errors, authLink, httpLink]);
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
//end of apollo-setup

const App = () => {
  console.log('render App');
  return (
    <ApolloProvider client={client}>
      <UserContextProvider>
        <PaperProvider theme={theme} settings={{icon:props=><Feather{...props}/>}}>
          <NavigationContainer theme={theme}>
            <Navigator />
          </NavigationContainer>
        </PaperProvider>
      </UserContextProvider>
    </ApolloProvider>
  );
};

export default App;
