import { ADD_PROJECT } from './interfaces'
import NaeptApi from '../../../naept/NaeptApi'
import store from '..';
import { Project } from '../../interfaces';

export const loadUserProjects = () => (dispatch: typeof store.dispatch) => {
    return NaeptApi.fetchNaeptApi('user/projects')
    .then(response => {
        let projects = response.data
        projects.forEach( (project: Project) =>
            dispatch({
                type:       ADD_PROJECT,
                project:    project
            })
        )
    })
}
