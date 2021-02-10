import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const initialForms = {
  access_token: '',
  user: {
    id: '',
    username: '',
    email: '',
  },
};

export const UserContext = createContext({...initialForms});

/* TYPES */
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
/* END */

/* REDUCERS */
const reducer = (state, {type, payload}) => {
  switch (type) {
    case LOGOUT:
      return {
        ...state,
        ...initialForms,
      };
    case LOGIN: {
      const {access_token, user} = payload;
      return {
        ...state,
        access_token,
        user,
      };
    }
    case REGISTER: {
      const {access_token, user} = payload;
      return {
        ...state,
        access_token,
        user,
      };
    }
    default:
      //return state;
      throw new Error(`Unhandled action type: ${type}`);
  }
};
/* END */

//let token=''

export const UserContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, useAuth());

  useEffect(() => {
    if (state.access_token !== '') {
      AsyncStorage.setItem('@userInfo', JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    const getStorageItem = async () => {
      let savedState = await AsyncStorage.getItem(
        '@userInfo',
        (error, value) => {
          JSON.parse(value);
        },
      );
      //console.log(savedState);
         if (savedState!==null && savedState.access_token !== undefined) {
           dispatch({type: LOGIN, payload: savedState});
         }
    };
    getStorageItem();
  }, []);

  return (
    <UserContext.Provider value={{state, dispatch}}>
      {props.children}
    </UserContext.Provider>
  );
};

//export default UserContextProvider;
export const useAuth = () => useContext(UserContext);
