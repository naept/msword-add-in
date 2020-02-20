import * as React from "react";
import { connect } from 'react-redux'
// import { subscribe } from 'redux-subscriber';
import { loadUserProjects, loadProjectDocuments } from '../store/project/actions'
import { ComboBox, IComboBoxOption, Stack, Label, Spinner, SpinnerSize } from "office-ui-fabric-react";
import { Project, Document } from "../interfaces";

export interface Props {
  userAuthenticated: boolean
  loadUserProjects: Function
  loadProjectDocuments: Function
  projectsOptions : IComboBoxOption[]
  documentsOptions : IComboBoxOption[]
}

export interface State {
  project: Project
  document: Document
  loadingProjects: boolean
  loadingDocuments: boolean
}

class ImportView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
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
  }

  componentDidMount() {
    this.props.loadUserProjects()
    .then(() => {
      this.setState(() => ({
        loadingProjects: false
      }))
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
      this.props.loadProjectDocuments(option.key)
      .then(() => {
        this.setState(() => ({
          loadingDocuments: false
        }))
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
      // this.props.loadProjectDocuments(option.key)
    }
  }

  renderLoadingProjectsSpinner = () => {
    if (this.state.loadingProjects) {
      return (
        <Spinner size={SpinnerSize.xSmall} />
      )
    } else {
      return null
    }
  }

  renderLoadingDocumentsSpinner = () => {
    if (this.state.loadingDocuments) {
      return (
        <Spinner size={SpinnerSize.xSmall} />
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <section>
        <Stack horizontal={true} verticalAlign='center' tokens={{childrenGap: 10}}>
          <Label>Select a project</Label>
          <this.renderLoadingProjectsSpinner/>
        </Stack>
        <ComboBox
          options={this.props.projectsOptions}
          onChange={this.handleProjectSelectChange}
          text={this.state.project.name}
          disabled={this.state.loadingProjects}
        />

        <Stack horizontal={true} verticalAlign='center' tokens={{childrenGap: 10}}>
          <Label>Select a document</Label>
          <this.renderLoadingDocumentsSpinner/>
        </Stack>
        <ComboBox
          options={this.props.documentsOptions}
          onChange={this.handleDocumentSelectChange}
          text={this.state.document.name}
          disabled={this.state.project.name == '' || this.state.loadingDocuments}
        />
      </section>
    )
  }
}

const mapStateToProps = ({projects}) => ({
  projectsOptions: Object.values(projects.projects).map((project: Project) => {
    return {
      key:  project.id,
      text: project.name,
    }
  }),
  documentsOptions: Object.values(projects.documents).map((document: Document) => {
    return {
      key:  document.id,
      text: document.name,
    }
  }),
})

export default connect(mapStateToProps, { loadUserProjects, loadProjectDocuments })(ImportView)
