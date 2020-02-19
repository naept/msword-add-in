import { NavOption } from "../../interfaces";

export const SET_NAV  = 'SET_NAV'

interface SetNavAction {
    type: typeof SET_NAV
    nav: NavOption
}

export type NavActionTypes = SetNavAction // | SomeOtherAction

export interface NavState {
    nav: NavOption
}
