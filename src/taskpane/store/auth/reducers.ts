import { AuthState, AuthActionTypes, LOGIN } from './interfaces'

const initialState: AuthState = {
  token: "",
  user: {
    name: "",
  }
}
  
export function authReducer (state = initialState, action: AuthActionTypes) {
  switch(action.type){
    case LOGIN:
      return {
        ...state,
        token: action.token,
        user: action.user,
      }

    default:
      return state
  }
}

