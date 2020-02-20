import * as React from "react";
import { connect } from 'react-redux'
// import { subscribe } from 'redux-subscriber';
import { loadUserProjects, loadProjectDocuments } from '../store/project/actions'
import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";
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
    }
  }

  componentDidMount() {
    this.props.loadUserProjects()
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
      }))
      this.props.loadProjectDocuments(option.key)
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



  render() {
    return (
      <section>
        <ComboBox
          label="Select a project"
          options={this.props.projectsOptions}
          onChange={this.handleProjectSelectChange}
          text={this.state.project.name}
          disabled={this.props.projectsOptions.length == 0}
        />
        <ComboBox
          label="Select a document"
          options={this.props.documentsOptions}
          onChange={this.handleDocumentSelectChange}
          text={this.state.document.name}
          disabled={this.props.documentsOptions.length == 0}
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
