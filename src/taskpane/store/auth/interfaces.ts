import { User } from "../../interfaces";

export const LOGIN = 'LOGIN'
// export const SET_USER = 'SET_USER'

interface SetTokenAction {
    type: typeof LOGIN
    token: string
    user: User
}

export type AuthActionTypes = SetTokenAction // | SomeOtherAction

export interface AuthState {
    token: string
    user: User
}
