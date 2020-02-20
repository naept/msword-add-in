import { ADD_PROJECT, ADD_DOCUMENT, CLEAR_DOCUMENTS } from './interfaces'
import NaeptApi from '../../../naept/NaeptApi'
import store from '..';
import { Project, Document } from '../../interfaces';

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

export const loadProjectDocuments = (project_id: string) => (dispatch: typeof store.dispatch) => {
    dispatch({
        type:   CLEAR_DOCUMENTS,
    })
    return NaeptApi.fetchNaeptApi('projects/documents/' + project_id)
    .then(response => {
        let documents = response.data
        documents.forEach( (document: Document) =>
            dispatch({
                type:       ADD_DOCUMENT,
                document:   document
            })
        )
    })
}
