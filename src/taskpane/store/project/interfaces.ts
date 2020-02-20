import { Project, Document } from "../../interfaces";

export const ADD_PROJECT = 'ADD_PROJECT'
export const CLEAR_DOCUMENTS = 'CLEAR_DOCUMENTS'
export const ADD_DOCUMENT = 'ADD_DOCUMENT'

interface AddProjectAction {
    type:       typeof ADD_PROJECT
    project:    Project
}

interface ClearDocumentsAction {
    type:       typeof CLEAR_DOCUMENTS
}

interface AddDocumentAction {
    type:       typeof ADD_DOCUMENT
    document:   Document
}

export type ProjectsActionTypes = AddProjectAction | ClearDocumentsAction | AddDocumentAction

export interface ProjectsState {
    projects    : {}
    documents   : {}
}
