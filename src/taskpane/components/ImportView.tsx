import * as React from "react";
import NaeptApi from '../../naept/NaeptApi'
import NavStore from '../store/NavStore'
import { NavOption } from "../interfaces";
import ProjectStore from '../store/ProjectStore'
import NewDocumentForm from './NewDocumentForm'
import { ComboBox, IComboBoxOption, Stack, Label, Spinner, SpinnerSize, SelectableOptionMenuItemType } from "office-ui-fabric-react";
import { Project, Document } from "../interfaces";

interface Props {
  navStore: NavStore
}

interface State {
  projectsOptions : IComboBoxOption[]
  documentsOptions : IComboBoxOption[]
  project: Project
  document: Document
  loadingProjects: boolean
  loadingDocuments: boolean
}

class ImportView extends React.Component<Props, State> {
  private projectStore: ProjectStore = new ProjectStore()
  private addProject: (project: Project) => void
  private clearDocuments: () => void
  private addDocument: (document: Document) => void
  private setNav: (nav: NavOption, errorMessage: String) => void

  constructor(props: Props) {
    super(props);
    this.state = {
      projectsOptions: [],
      documentsOptions: [],
      project: {
        id: '',
        name: ''
      },
      document: {
        id: '',
        name: ''
      },
      loadingProjects: true,
      loadingDocuments: false,
    }
    this.setNav = this.props.navStore.setNav.bind(this.props.navStore)
    
    // On souscrit aux changements du store
    this.projectStore.onChange((store) => {
      this.setState({
        projectsOptions: Object.values(store.projects)
        .map((project: Project) => {
          return {
            key:  project.id,
            text: project.name,
            itemType: SelectableOptionMenuItemType.Normal,
          }
        }),
        documentsOptions: Object.values(store.documents)
        .map((document: Document) => {
          return {
            key:  document.id,
            text: document.name,
            itemType: SelectableOptionMenuItemType.Normal,
          }
        })
        .concat([
          {
            key:  'divider',
            text: '-',
            itemType: SelectableOptionMenuItemType.Divider,
          },
          {
            key:  'addNewDocument',
            text: 'Add new document',
            itemType: SelectableOptionMenuItemType.Normal,
          },
        ]),
      })
    })

    // On injecte les méthodes du store en méthode du composant
    this.addProject = this.projectStore.addProject.bind(this.projectStore)
    this.clearDocuments = this.projectStore.clearDocuments.bind(this.projectStore)
    this.addDocument = this.projectStore.addDocument.bind(this.projectStore)
  }

  componentDidMount() {
    this.loadUserProjects()
    .then(() => {
      this.setState(() => ({
        loadingProjects: false
      }))
    })
    .catch((error) => {
      if (error.error === "Unauthenticated.") {
        this.setNav(NavOption.Settings, "Authentication failed. Maybe your API key expired.")
      }
    })
  }

  loadUserProjects() {
    return NaeptApi.fetchNaeptApi('user/projects')
    .then(response => {
        let projects = response.data
        projects.forEach((project: Project) =>
            this.addProject(project)
        )
    })
  }

  loadProjectDocuments(project_id: String) {
    return NaeptApi.fetchNaeptApi('projects/documents/' + project_id)
    .then(response => {
        this.clearDocuments()
        let projects = response.data
        projects.forEach((document: Document) =>
            this.addDocument(document)
        )
    })
  }

  handleProjectSelectChange = (event, option) => {
    if (event) {
      this.setState((state) => ({
        project: {
          ...state.project,
          id: option.key,
          name: option.text,
        },
        document: {
          ...state.document,
          id: '',
          name: '',
        },
        loadingDocuments: true
      }))

      this.loadProjectDocuments(option.key)
      .then(() => {
        this.setState(() => ({
          loadingDocuments: false
        }))
      })
      .catch((error) => {
        console.error(error)
      })
    }
  }

  handleDocumentSelectChange = (event, option) => {
    if (event) {
      this.setState((state) => ({
        document: {
          ...state.document,
          id: option.key,
          name: option.text,
        },
      }))
    }
  }

  render() {
    return (
      <section>
        <Stack horizontal={true} verticalAlign='center' tokens={{childrenGap: 10}}>
          <Label>Select a project</Label>
          {this.state.loadingProjects && <Spinner size={SpinnerSize.xSmall} />}
        </Stack>
        <ComboBox
          options={this.state.projectsOptions}
          onChange={this.handleProjectSelectChange}
          text={this.state.project.name}
          disabled={this.state.loadingProjects}
        />

        <Stack horizontal={true} verticalAlign='center' tokens={{childrenGap: 10}}>
          <Label>Select a document</Label>
          {this.state.loadingDocuments && <Spinner size={SpinnerSize.xSmall} />}
        </Stack>
        <ComboBox
          options={this.state.documentsOptions}
          onChange={this.handleDocumentSelectChange}
          text={this.state.document.name}
          disabled={this.state.project.name == '' || this.state.loadingDocuments}
        />

        {this.state.document.id === 'addNewDocument' && <NewDocumentForm/>}
      </section>
    )
  }
}

export default ImportView
