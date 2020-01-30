export const LOGIN = 'LOGIN'
// export const SET_USER = 'SET_USER'

interface SetTokenAction {
    type: typeof LOGIN
    token: string
}

export type AuthActionTypes = SetTokenAction // | SomeOtherAction

export interface AuthState {
    token: string
    user: 
}
