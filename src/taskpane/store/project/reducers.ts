import { ProjectsState, ProjectsActionTypes, ADD_PROJECT, ADD_DOCUMENT, CLEAR_DOCUMENTS } from './interfaces'
import { Document } from '../../interfaces';

const initialState: ProjectsState = {
  projects: {},
  documents: {},
}
  
export function projectsReducer (state = initialState, action: ProjectsActionTypes) {
  switch(action.type){
    case ADD_PROJECT:
      let project = action.project
      let localProject = state.projects[project.id] || {}  // Retreiving project in store if possible

      localProject = {...localProject, ...project} // Merging properties with project already in store
      return {
        ...state,
        projects: {
          ...state.projects,
          ...{[project.id]: localProject},
      }}

    case CLEAR_DOCUMENTS:
      Object.values(state.documents)
      .map((document: Document) => document.id)
      .forEach((document_id: any) => {
        state.documents[document_id] = null
        delete state.documents[document_id]
      })
      return {
        ...state,
        documents: {}
      }

    case ADD_DOCUMENT:
      let document = action.document
      let localDocument = state.documents[document.id] || {}  // Retreiving document in store if possible

      localDocument = {...localDocument, ...document} // Merging properties with document already in store
      return {
        ...state,
        documents: {
          ...state.documents,
          ...{[document.id]: localDocument},
      }}
      
    default:
      return state
  }
}