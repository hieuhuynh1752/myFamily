import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const initialForms = {
  access_token: '',
  user: {
    id: '',
    username: '',
    email: '',
    role: {
      name: '',
      type: '',
      description: '',
    },
  },
};

export const UserContext = createContext({...initialForms});

/* TYPES */
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
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
    default:
      //return state;
      throw new Error(`Unhandled action type: ${type}`);
  }
};
/* END */

//let token=''

export const UserContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, useContext(UserContext));

  useEffect(() => {
    if (state.access_token !== '') {
      AsyncStorage.setItem('@userInfo', JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    AsyncStorage.getItem('@userInfo').then((savedState) => {
      if (savedState.access_token !== undefined) {
        dispatch({type: LOGIN, payload: savedState});
      }
    });
  });

  return (
    <UserContext.Provider value={{state, dispatch}}>
      {props.children}
    </UserContext.Provider>
  );
};

//export default UserContextProvider;
export const useAuth = () => useContext(UserContext);
