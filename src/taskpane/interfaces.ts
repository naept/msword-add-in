
export interface Project {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  project_id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  document_id: string;
  name: string;
  description: string;
}

export interface Requirement {
  category_id: string;
  name: string;
  description: string;
}

export interface ElementLocation {
  projectId: string;
  documentId: string;
  categoryId: string;
}

export enum NavOption {
  Main = "MAIN",
  Settings = "SETTINGS"
}
