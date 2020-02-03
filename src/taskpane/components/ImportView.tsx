import * as React from "react";
import { connect } from 'react-redux'
import { subscribe } from 'redux-subscriber';
import { loadUserProjects } from '../store/project/actions'
import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";
import { Project } from "../interfaces";

export interface Props {
  userAuthenticated: boolean
  loadUserProjects: Function
  projectsOptions : IComboBoxOption[]
}

export interface State {
  unsubscribe:      Function
}

class ImportView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      unsubscribe: subscribe('auth.token', state => {
        if (state.auth.token != "") {
          this.props.loadUserProjects()
        }
      }),
    }
  }

  componentDidMount() {
    if (this.props.userAuthenticated) {
      this.props.loadUserProjects()
    }
  }

  render() {
    if (!this.props.userAuthenticated) {
      return null
    }

    return (
      <section>
        <ComboBox
          label="Select a project"
          autoComplete="on"
          options={this.props.projectsOptions}
        />
      </section>
    )
  }
}

const mapStateToProps = ({auth, projects}) => ({
  projectsOptions: Object.values(projects.projects).map((project: Project) => {
    return {
      key:  project.id,
      text: project.name,
    }
  }),
  userAuthenticated : auth.token != "",
})


export default connect(mapStateToProps, { loadUserProjects })(ImportView)
