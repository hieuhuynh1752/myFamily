import React, {useState, useCallback, useMemo} from 'react';
import {ApolloClient, InMemoryCache, from, HttpLink} from '@apollo/client';
import {ApolloProvider} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {NavigationContainer} from '@react-navigation/native';
import {getToken} from './utils/authenSetup';
import {onError} from '@apollo/client/link/error';
import {UserContextProvider} from './context/userContext';
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  PreferencesContext,
} from './context/themeContext';
import Navigator from './navigation/Navigator';
//import theme from './utils/theme';
import {Provider as PaperProvider} from 'react-native-paper';
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
  //theme-setup
  const [isThemeDark, setIsThemeDark] = useState(false);
  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );
  //end of theme-setup

  return (
    <ApolloProvider client={client}>
      <UserContextProvider>
        <PreferencesContext.Provider value={preferences}>
          <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
              <Navigator />
            </NavigationContainer>
          </PaperProvider>
        </PreferencesContext.Provider>
      </UserContextProvider>
    </ApolloProvider>
  );
};

export default App;
