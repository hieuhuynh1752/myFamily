import AsyncStorage from '@react-native-community/async-storage';

let token;

export const getToken = async () => {
  if (token) {
    return Promise.resolve(token);
  }
  let savedState = await AsyncStorage.getItem('@userInfo', (error, value) => {
    JSON.parse(value);
  });
  if (savedState !== null && savedState.access_token !== undefined) {
    return savedState.access_token;
  } else return token;
};
