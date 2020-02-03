import { AuthState, AuthActionTypes, LOGIN, LOGOUT } from './interfaces'
import { getCookie, setCookie, removeCookie } from '../../lib/cookies'

const initialState: AuthState = {
  token: getCookie('authToken'),
  user: getCookie('user'),
}
  
export function authReducer (state = initialState, action: AuthActionTypes) {
  switch(action.type){
    case LOGIN:
      setCookie('authToken', action.token, null)
      setCookie('user', action.user, null)
      return {
        ...state,
        token: action.token,
        user: action.user,
      }

    case LOGOUT:
      removeCookie('authToken')
      return {
        ...state,
        token: "",
        user: {
          name: "",
        }
      }

    default:
      return state
  }
}

