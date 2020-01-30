import { LOGIN } from './interfaces'
import NaeptApi from '../../../naept/NaeptApi'
import store from '..';
import { Credentials } from '../../interfaces';

export const login = (credentials: Credentials) => (dispatch: typeof store.dispatch) => {
    return NaeptApi.fetchNaeptApi('auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
        })
    })
    .then(response => {
        dispatch({
            type: LOGIN,
            token: response.token,
        })
    })
}
