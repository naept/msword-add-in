import * as React from "react";
import NaeptApi from "../../naept/NaeptApi";
import { NavContext } from "../context/NavContext";
import { NavOption, ElementLocation } from "../interfaces";
import ProjectStore from "../store/ProjectStore";
import {
  ComboBox,
  IComboBoxOption,
  Stack,
  Label,
  Spinner,
  SpinnerSize,
  SelectableOptionMenuItemType
} from "office-ui-fabric-react";
import { Project, Document } from "../interfaces";

interface Props {
  onChange?: (newValue: ElementLocation) => void;
}

interface State {
  projectsOptions: IComboBoxOption[];
  documentsOptions: IComboBoxOption[];
  project: Project;
  document: Document;
  loadingProjects: boolean;
  loadingDocuments: boolean;
}

export default class ElementSelector extends React.Component<Props, State> {
  static contextType = NavContext;
  private projectStore: ProjectStore = new ProjectStore();
  private addProject: (project: Project) => void;
  private clearDocuments: () => void;
  private addDocument: (document: Document) => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      projectsOptions: [],
      documentsOptions: [],
      project: {
        id: "",
        name: ""
      },
      document: {
        id: "",
        name: ""
      },
      loadingProjects: false,
      loadingDocuments: false
    };

    // On souscrit aux changements du store
    this.projectStore.onChange(store => {
      this.setState({
        projectsOptions: Object.values(store.projects).map((project: Project) => {
          return {
            key: project.id,
            text: project.name,
            itemType: SelectableOptionMenuItemType.Normal
          };
        }),
        documentsOptions: Object.values(store.documents)
          .map((document: Document) => {
            return {
              key: document.id,
              text: document.name,
              itemType: SelectableOptionMenuItemType.Normal
            };
          })
          .concat([
            {
              key: "divider",
              text: "-",
              itemType: SelectableOptionMenuItemType.Divider
            },
            {
              key: "addNewDocument",
              text: "Add new document",
              itemType: SelectableOptionMenuItemType.Normal
            }
          ])
      });
    });

    // On injecte les méthodes du store en méthode du composant
    this.addProject = this.projectStore.addProject.bind(this.projectStore);
    this.clearDocuments = this.projectStore.clearDocuments.bind(this.projectStore);
    this.addDocument = this.projectStore.addDocument.bind(this.projectStore);
  }

  componentDidMount() {
    this.loadUserProjects().catch(error => {
      if (error.error === "Unauthenticated.") {
        const navStore = this.context;
        navStore.setNav(NavOption.Settings, "Authentication failed. Maybe your API key expired.");
      }
    });
  }

  loadUserProjects() {
    this.setState(() => ({
      loadingProjects: true
    }));
    return NaeptApi.fetchNaeptApi("user/projects").then(response => {
      let projects = response.data;
      projects.forEach((project: Project) => this.addProject(project));
      this.setState(() => ({
        loadingProjects: false
      }));
    });
  }

  loadProjectDocuments(project_id: String) {
    this.setState(() => ({
      loadingDocuments: true
    }));
    return NaeptApi.fetchNaeptApi("projects/documents/" + project_id).then(response => {
      this.clearDocuments();
      let projects = response.data;
      projects.forEach((document: Document) => this.addDocument(document));
      this.setState(() => ({
        loadingDocuments: false
      }));
    });
  }

  handleProjectSelectChange = (event, option) => {
    if (event) {
      this.setState(
        state => ({
          project: {
            ...state.project,
            id: option.key,
            name: option.text
          },
          document: {
            ...state.document,
            id: "",
            name: ""
          }
        }),
        () => this.notifyChange()
      );

      this.loadProjectDocuments(option.key).catch(error => {
        console.error(error);
      });
    }
  };

  handleDocumentSelectChange = (event, option) => {
    if (event) {
      this.setState(
        state => ({
          document: {
            ...state.document,
            id: option.key,
            name: option.text
          }
        }),
        () => this.notifyChange()
      );
    }
  };

  notifyChange() {
    this.props.onChange({
      projectId: this.state.project.id,
      documentId: this.state.document.id,
      categoryId: "",
      requirementId: ""
    });
  }

  render() {
    return (
      <section>
        <Stack horizontal={true} verticalAlign="center" tokens={{ childrenGap: 10 }}>
          <Label>Select a project</Label>
          {this.state.loadingProjects && <Spinner size={SpinnerSize.xSmall} />}
        </Stack>
        <ComboBox
          options={this.state.projectsOptions}
          onChange={this.handleProjectSelectChange}
          text={this.state.project.name}
          disabled={this.state.loadingProjects}
        />

        <Stack horizontal={true} verticalAlign="center" tokens={{ childrenGap: 10 }}>
          <Label>Select a document</Label>
          {this.state.loadingDocuments && <Spinner size={SpinnerSize.xSmall} />}
        </Stack>
        <ComboBox
          options={this.state.documentsOptions}
          onChange={this.handleDocumentSelectChange}
          text={this.state.document.name}
          disabled={this.state.project.name == "" || this.state.loadingDocuments}
        />
      </section>
    );
  }
}
