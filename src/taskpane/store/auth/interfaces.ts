import { User } from "../../interfaces";

export const LOGIN  = 'LOGIN'
export const LOGOUT = 'LOGOUT'

interface LoginAction {
    type: typeof LOGIN
    token: string
    user: User
}
interface LogoutAction {
    type: typeof LOGOUT
}

export type AuthActionTypes = LoginAction | LogoutAction

export interface AuthState {
    token: string
    user: User
}
