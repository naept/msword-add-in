import NaeptApi from "../../naept/NaeptApi";
import { Project, Document, ElementLocation } from "../interfaces";

declare type ChangeCallback = (store: ProjectStore) => void;

export default class ProjectStore {
  public projects: {} = {};
  public documents: {} = {};
  public selectedElementLocation: ElementLocation = {
    projectId: "",
    documentId: "",
    categoryId: "",
    requirementId: ""
  };

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

  loadUserProjectsAsync() {
    return NaeptApi.fetchNaeptApi("user/projects").then(response => {
      let projects = response.data;
      projects.forEach((project: Project) => this.addProject(project));
      this.clearDocuments()
    });
  }

  loadProjectDocumentsAsync(project_id: string) {
    this.clearDocuments();
    return NaeptApi.fetchNaeptApi("projects/documents/" + project_id).then(response => {
        let projects = response.data;
        projects.forEach((document: Document) => this.addDocument(document));
    });
  }

  createDocumentAsync(document: Document) {
    return NaeptApi.fetchNaeptApi("documents", {
      method: 'POST',
      body: JSON.stringify(document)
    }).then((response) => {
      let document: Document = response.data
      this.addDocument(document)
      this.setSelectedDocumentLocation(document.id)
    })
  }

  setSelectedElementLocation(elementLocation: ElementLocation) {
    this.selectedElementLocation = {
      projectId: elementLocation.projectId,
      documentId: elementLocation.documentId,
      categoryId: elementLocation.categoryId,
      requirementId: elementLocation.requirementId
    }
    this.inform();
  }

  private setSelectedDocumentLocation(document_id: string) {
    this.selectedElementLocation.documentId = document_id
    this.inform();
  }

  private addProject(project: Project) {
    let localProject = this.projects[project.id] || {}; // Retreiving project in store if possible
    localProject = { ...localProject, ...project }; // Merging properties with project already in store
    this.projects = { ...this.projects, ...{ [project.id]: localProject } };
    this.inform();
  }

  private clearDocuments() {
    this.documents = {};
    this.inform();
  }

  private addDocument(document: Document) {
    let localDocument = this.documents[document.id] || {}; // Retreiving document in store if possible
    localDocument = { ...localDocument, ...document }; // Merging properties with document already in store
    this.documents = { ...this.documents, ...{ [document.id]: localDocument } };
    this.inform();
  }
}
