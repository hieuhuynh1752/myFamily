import  AsyncStorage  from '@react-native-community/async-storage';

let token;

export const getToken = async () => {
  if (token) {
    return Promise.resolve(token);
  }

  AsyncStorage.getItem('@userInfo').then((savedState) => {
    if (savedState.access_token !== undefined) {
      return savedState.access_token;
    } else return token;
  });
};

