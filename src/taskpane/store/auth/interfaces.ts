import { User } from "../../interfaces";

export const LOGIN = 'LOGIN'

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
