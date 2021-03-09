import AsyncStorage from '@react-native-community/async-storage';

let token;

export const getToken = async () => {
  if (token) {
    return Promise.resolve(token);
  }
  let savedState = await AsyncStorage.getItem('@userInfo');
  if (savedState !== null && JSON.parse(savedState).access_token!=="") {
    let savedToken = JSON.parse(savedState).access_token;
    return savedToken;
  } else return token;
};
