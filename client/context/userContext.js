import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const initialForms = {
  access_token: '',
  user: {
    id: '',
    username: '',
    email: '',
  },
  familyId: 0,
  familyName: '',
  memberId: 0,
  members: [],
  role: '',
};

export const UserContext = createContext({...initialForms});

/* TYPES */
//authorization types
export const LOGIN = 'LOGIN';
export const LOGIN_BY_CACHE = 'LOGIN_BY_CACHE';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';

//usage types
export const SELECT_FAMILY = 'SELECT_FAMILY';

/* END */

/* REDUCERS */
const reducer = (state, {type, payload}) => {
  switch (type) {
    //authentication cases
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
    case LOGIN_BY_CACHE: {
      const {
        access_token,
        user,
        familyId,
        familyName,
        memberId,
        members,
        role,
      } = payload;
      return {
        ...state,
        access_token,
        user,
        familyId,
        familyName,
        memberId,
        members,
        role,
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
    //end of authentication cases

    //usage case
    case SELECT_FAMILY: {
      return {
        ...state,
        familyId: parseInt(payload.family.id),
        familyName: payload.family.name,
        memberId: parseInt(payload.id),
        members: payload.family.familyMember,
        role: payload.role,
      };
    }
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};
/* END */

export const UserContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, useAuth());

  useEffect(() => {
    if (state.access_token !== '') {
      AsyncStorage.setItem('@userInfo', JSON.stringify(state));
    }
  }, [state]);

  return (
    <UserContext.Provider value={{state, dispatch}}>
      {props.children}
    </UserContext.Provider>
  );
};

//export default UserContextProvider;
export const useAuth = () => useContext(UserContext);
