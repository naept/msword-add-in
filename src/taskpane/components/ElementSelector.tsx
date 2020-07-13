import * as React from "react";
import { GlobalContext } from "../context/GlobalContext";
import { NavOption, ElementLocation, Category } from "../interfaces";
import {
  // ComboBox,
  // IComboBoxOption,
  Stack,
  Label,
  Spinner,
  SpinnerSize,
  SelectableOptionMenuItemType,
  Dropdown,
  IDropdownOption,
  ResponsiveMode
} from "office-ui-fabric-react";
import { Project, Document } from "../interfaces";
import ProjectStore from "../store/ProjectStore";
import NavStore from "../store/NavStore";

interface Props {
  onChange?: (newValue: ElementLocation) => void;
}

interface State {
  projectsOptions: IDropdownOption[];
  documentsOptions: IDropdownOption[];
  categoriesOptions: IDropdownOption[];
  elementLocation: ElementLocation;
  loadingProjects: boolean;
  loadingDocuments: boolean;
  loadingCategories: boolean;
}

export default class ElementSelector extends React.Component<Props, State> {
  static contextType = GlobalContext;

  private onChangeProjectStoreCallbackId: number = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      projectsOptions: [],
      documentsOptions: [],
      categoriesOptions: [],
      elementLocation: {
        projectId: "",
        documentId: "",
        categoryId: ""
      },
      loadingProjects: false,
      loadingDocuments: false,
      loadingCategories: false
    };
  }

  componentDidMount() {
    // On souscrit aux changements du projectStore
    const projectStore: ProjectStore = this.context.projectStore;
    this.onChangeProjectStoreCallbackId = projectStore.onChange(store => {
      this.setState({
        projectsOptions: Object.values(store.projects)
          .sort((a: Project, b: Project) => a.name.localeCompare(b.name))
          .map((project: Project) => {
            return {
              key: project.id,
              text: project.name,
              itemType: SelectableOptionMenuItemType.Normal
            };
          }),
        documentsOptions: Object.values(store.documents)
          .sort((a: Document, b: Document) => a.name.localeCompare(b.name))
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
          ]),
        categoriesOptions: [
            {
              key: "",
              text: "No category",
              itemType: SelectableOptionMenuItemType.Normal,
              data: null
            }
          ]
          .concat(Object.values(store.getAccessibleCategories())
            .sort((a: Category, b: Category) => a._lft - b._lft)
            .map((category: Category, _index, array: []) => {
              var depth = array.filter(
                (element: Category) => element._lft < category._lft && element._rgt > category._rgt,
              ).length
              return {
                key: category.id,
                text: category.name,
                itemType: SelectableOptionMenuItemType.Normal,
                data: {
                  depth: depth
                }
              };
            })
          )
          .concat([
            {
              key: "divider",
              text: "-",
              itemType: SelectableOptionMenuItemType.Divider,
              data: null
            },
            {
              key: "addNewCategory",
              text: "Add new category",
              itemType: SelectableOptionMenuItemType.Normal,
              data: null
            }
          ])
      });
    });

    this.loadUserProjects().catch(error => {
      if (error.error === "Unauthenticated.") {
        const navStore: NavStore = this.context.navStore;
        navStore.setNav(NavOption.Settings, "Authentication failed. Maybe your API key expired.");
      }
    });
  }

  componentWillUnmount() {
    const projectStore: ProjectStore = this.context.projectStore;
    projectStore.onChangeUnsubscribe(this.onChangeProjectStoreCallbackId);
  }

  loadUserProjects() {
    const projectStore: ProjectStore = this.context.projectStore;
    this.setState(() => ({
      loadingProjects: true
    }));
    return projectStore.loadUserProjectsAsync().then(() => {
      this.setState(() => ({
        loadingProjects: false
      }));
    });
  }

  loadProjectStructure(project_id: string) {
    const projectStore: ProjectStore = this.context.projectStore;
    this.setState(() => ({
      loadingDocuments: true,
      loadingCategories: true
    }));
    return projectStore.loadProjectStructureAsync(project_id).then(() => {
      this.setState(() => ({
        loadingDocuments: false,
        loadingCategories: false
      }));
    });
  }

  handleProjectSelectChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
    if (event) {
      const projectStore: ProjectStore = this.context.projectStore;
      this.setState(
        {
          elementLocation: {
            ...projectStore.selectedElementLocation,
            projectId: item.key.toString(),
            documentId: "",
            categoryId: ""
          }
        },
        () => this.notifyChange()
      );

      this.loadProjectStructure(item.key.toString()).catch(error => {
        console.error(error);
      });
    }
  };

  handleDocumentSelectChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
    if (event) {
      const projectStore: ProjectStore = this.context.projectStore;
      this.setState(
        {
          elementLocation: {
            ...projectStore.selectedElementLocation,
            documentId: item.key.toString(),
            categoryId: ""
          }
        },
        () => this.notifyChange()
      );
    }
  };

  handleCategorySelectChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
    if (event) {
      const projectStore: ProjectStore = this.context.projectStore;
      this.setState(
        {
          elementLocation: {
            ...projectStore.selectedElementLocation,
            categoryId: item.key.toString()
          }
        },
        () => this.notifyChange()
      );
    }
  };

  onRenderOption = (option: IDropdownOption): JSX.Element => {
    const indent = []

    if (option.data && option.data.depth) {
      for (let index = 0; index < option.data.depth; index++) {
        indent.push(<span>&emsp;</span>)
      }
    }

    return (
      <span>{indent}{option.text}</span>
    )
  };

  onRenderTitle = (options: IDropdownOption[]): JSX.Element => {
    const option = options[0];
    const indent = []

    if (option.data && option.data.depth) {
      for (let index = 0; index < option.data.depth; index++) {
        indent.push(<span>&emsp;</span>)
      }
    }

    return (
      <span>{indent}{option.text}</span>
    )
  };

  notifyChange() {
    const projectStore: ProjectStore = this.context.projectStore;
    projectStore.setSelectedElementLocation({
      projectId: this.state.elementLocation.projectId,
      documentId: this.state.elementLocation.documentId,
      categoryId: this.state.elementLocation.categoryId
    });
  }

  render() {
    const projectStore: ProjectStore = this.context.projectStore;
    return (
      <section>
        <Stack horizontal={true} verticalAlign="center" tokens={{ childrenGap: 10 }}>
          <Label>Select a project</Label>
          {this.state.loadingProjects && <Spinner size={SpinnerSize.xSmall} />}
        </Stack>
        <Dropdown
          placeholder="Select a project"
          options={this.state.projectsOptions}
          onChange={this.handleProjectSelectChange}
          selectedKey={projectStore.selectedElementLocation.projectId}
          disabled={this.state.loadingProjects}
          responsiveMode={ResponsiveMode.large}
        />

        <Stack horizontal={true} verticalAlign="center" tokens={{ childrenGap: 10 }}>
          <Label>Select a document</Label>
          {this.state.loadingDocuments && <Spinner size={SpinnerSize.xSmall} />}
        </Stack>
        <Dropdown
          placeholder="Select a document"
          options={this.state.documentsOptions}
          onChange={this.handleDocumentSelectChange}
          selectedKey={projectStore.selectedElementLocation.documentId}
          disabled={projectStore.selectedElementLocation.projectId === "" || this.state.loadingDocuments}
          responsiveMode={ResponsiveMode.large}
        />

        <Stack horizontal={true} verticalAlign="center" tokens={{ childrenGap: 10 }}>
          <Label>Select a category</Label>
          {this.state.loadingCategories && <Spinner size={SpinnerSize.xSmall} />}
        </Stack>
        <Dropdown
          options={this.state.categoriesOptions}
          onChange={this.handleCategorySelectChange}
          selectedKey={projectStore.selectedElementLocation.categoryId}
          disabled={
            projectStore.selectedElementLocation.documentId === "" ||
            projectStore.selectedElementLocation.documentId === "addNewDocument" ||
            this.state.loadingCategories
          }
          responsiveMode={ResponsiveMode.large}
          onRenderOption={this.onRenderOption}
          onRenderTitle={this.onRenderTitle}
        />
      </section>
    );
  }
}
