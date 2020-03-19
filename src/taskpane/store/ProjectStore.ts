import { Project, Document } from "../interfaces";

declare type ChangeCallback = (store: ProjectStore) => void;

export default class ProjectStore {
  public projects: {} = {};
  public documents: {} = {};

  private callbacks: ChangeCallback[] = [];

  /**
   * Informe les écouteurs d'un changement au sein du Store
   * */
  inform() {
    this.callbacks.forEach(cb => cb(this));
  }

  /**
   * Permet d'ajouter un écouteur
   * */
  onChange(cb: ChangeCallback) {
    this.callbacks.push(cb);
  }

  addProject(project: Project) {
    let localProject = this.projects[project.id] || {}; // Retreiving project in store if possible
    localProject = { ...localProject, ...project }; // Merging properties with project already in store
    this.projects = { ...this.projects, ...{ [project.id]: localProject } };
    this.inform();
  }

  clearDocuments() {
    this.documents = {};
    this.inform();
  }

  addDocument(document: Document) {
    let localDocument = this.documents[document.id] || {}; // Retreiving document in store if possible
    localDocument = { ...localDocument, ...document }; // Merging properties with document already in store
    this.documents = { ...this.documents, ...{ [document.id]: localDocument } };
    this.inform();
  }
}
