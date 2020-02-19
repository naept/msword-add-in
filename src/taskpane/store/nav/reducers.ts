import { NavState, NavActionTypes, SET_NAV } from './interfaces'
import { NavOption } from '../../interfaces'

const initialState: NavState = {
  nav: NavOption.Main,
}
  
export function navReducer (state = initialState, action: NavActionTypes) {
  switch(action.type){
    case SET_NAV:
      return {
        ...state,
        nav: action.nav,
      }

    default:
      return state
  }
}

