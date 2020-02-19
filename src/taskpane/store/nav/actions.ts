import { NavOption } from '../../interfaces'
import { SET_NAV } from './interfaces'
import store from '..';

export const setNav = (nav: NavOption) => (dispatch: typeof store.dispatch) => {
    dispatch({
        type: SET_NAV,
        nav: nav,
    })
}
