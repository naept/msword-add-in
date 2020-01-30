import { AuthState, AuthActionTypes, LOGIN } from './interfaces'

const initialState: AuthState = {
  token: ""
}
  
export function authReducer (state = initialState, action: AuthActionTypes) {
  switch(action.type){
    case LOGIN:
      return {
        ...state,
        token: action.token
      }
    default:
      return state
  }
}

