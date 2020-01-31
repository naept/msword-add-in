import { Project } from "../../interfaces";

export const ADD_PROJECT = 'ADD_PROJECT'

interface AddProjectsAction {
    type:       typeof ADD_PROJECT
    project:    Project
}

export type ProjectsActionTypes = AddProjectsAction // | SomeOtherAction

export interface ProjectsState {
    projects    : Project[]
}
