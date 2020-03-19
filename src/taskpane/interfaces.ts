export interface Credentials {
  email: string;
  password: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  name: string;
}

export interface User {
  name: string;
}

export enum NavOption {
  Main = "MAIN",
  Settings = "SETTINGS"
}

export interface ElementLocation {
  projectId: string;
  documentId: string;
  categoryId: string;
  requirementId: string;
}
