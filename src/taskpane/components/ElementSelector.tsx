import * as React from "react";
import { GlobalContext } from "../context/GlobalContext";
import { NavOption, ElementLocation } from "../interfaces";
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
  static contextType = GlobalContext;

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
        project_id: "",
        name: "",
        description: ""
      },
      loadingProjects: false,
      loadingDocuments: false
    };
  }

  componentDidMount() {
    // On souscrit aux changements du projectStore
    const projectStore = this.context.projectStore;
    projectStore.onChange(store => {
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

    this.loadUserProjects().catch(error => {
      if (error.error === "Unauthenticated.") {
        const navStore = this.context.navStore;
        navStore.setNav(NavOption.Settings, "Authentication failed. Maybe your API key expired.");
      }
    });
  }

  loadUserProjects() {
    const projectStore = this.context.projectStore;
    this.setState(() => ({
      loadingProjects: true
    }));
    return projectStore.loadUserProjectsAsync().then(() => {
      this.setState(() => ({
        loadingProjects: false
      }));
    });
  }

  loadProjectDocuments(project_id: String) {
    const projectStore = this.context.projectStore;
    this.setState(() => ({
      loadingDocuments: true
    }));
    return projectStore.loadProjectDocumentsAsync(project_id).then(() => {
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
