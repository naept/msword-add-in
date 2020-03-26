import NaeptApi from "../../naept/NaeptApi";
import { Project, Document, Category, ElementLocation, Requirement } from "../interfaces";

declare type ChangeCallback = (store: ProjectStore) => void;

export default class ProjectStore {
  public projects: {} = {};
  public documents: {} = {};
  public categories: {} = {};
  public selectedElementLocation: ElementLocation = {
    projectId: "",
    documentId: "",
    categoryId: ""
  };

  private callbacks: {} = {};
  private nextCallbackId: number = 0;

  /**
   * Informe les écouteurs d'un changement au sein du Store
   * */
  inform() {
    const callbacks: ChangeCallback[] = Object.values(this.callbacks);
    callbacks.forEach(cb => cb(this));
  }

  /**
   * Permet d'ajouter un écouteur
   * */
  onChange(cb: ChangeCallback) {
    this.callbacks[this.nextCallbackId] = cb;
    return this.nextCallbackId++;
  }

  /**
   * Permet de supprimer un écouteur
   * */
  onChangeUnsubscribe(callbackId: number) {
    delete this.callbacks[callbackId];
  }

  getAccessibleCategories() {
    return Object.values(this.categories).filter(
      (category: Category) => category.document_id === this.selectedElementLocation.documentId
    );
  }

  loadUserProjectsAsync() {
    return NaeptApi.fetchNaeptApi("user/projects").then(response => {
      this.clearProjects();
      this.clearDocuments();
      this.clearCategories();
      let projects = response.data;
      projects.forEach((project: Project) => this.addProject(project));
    });
  }

  loadProjectStructureAsync(project_id: string) {
    return NaeptApi.fetchNaeptApi("projects/structure/" + project_id).then(response => {
      this.clearDocuments();
      this.clearCategories();
      let documents = response.data.documents;
      documents.forEach((document: Document) => this.addDocument(document));
      let categories = response.data.categories;
      categories.forEach((category: Category) => this.addCategory(category));
    });
  }

  createDocumentAsync(document: Document) {
    return NaeptApi.fetchNaeptApi("documents", {
      method: "POST",
      body: JSON.stringify(document)
    }).then(response => {
      let document: Document = response.data;
      this.addDocument(document);
      this.setSelectedDocumentLocation(document.id);
    });
  }

  createCategoryAsync(category: Category) {
    return NaeptApi.fetchNaeptApi("categories", {
      method: "POST",
      body: JSON.stringify(category)
    }).then(response => {
      let category: Category = response.data;
      this.addCategory(category);
      this.setSelectedCategoryLocation(category.id);
    });
  }

  createRequirementAsync(requirement: Requirement) {
    return NaeptApi.fetchNaeptApi("requirements", {
      method: "POST",
      body: JSON.stringify({ ...requirement, phase: 1, progress: 100 })
    });
  }

  setSelectedElementLocation(elementLocation: ElementLocation) {
    this.selectedElementLocation = {
      projectId: elementLocation.projectId,
      documentId: elementLocation.documentId,
      categoryId: elementLocation.documentId === "addNewDocument" ? "" : elementLocation.categoryId
    };
    this.inform();
  }

  private setSelectedDocumentLocation(document_id: string) {
    this.selectedElementLocation.documentId = document_id;
    this.inform();
  }

  private setSelectedCategoryLocation(category_id: string) {
    this.selectedElementLocation.categoryId = category_id;
    this.inform();
  }

  private clearProjects() {
    this.projects = {};
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

  private clearCategories() {
    this.categories = {};
    this.inform();
  }

  private addCategory(category: Category) {
    let localCategory = this.categories[category.id] || {}; // Retreiving category in store if possible
    localCategory = { ...localCategory, ...category }; // Merging properties with category already in store
    this.categories = { ...this.categories, ...{ [category.id]: localCategory } };
    this.inform();
  }
}
