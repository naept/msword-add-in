import { ProjectsState, ProjectsActionTypes, ADD_PROJECT } from './interfaces'

const initialState: ProjectsState = {
  projects: []
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
      
    default:
      return state
  }
}