import * as React from "react";
import { connect } from 'react-redux'
import { subscribe } from 'redux-subscriber';
import { loadUserProjects } from '../store/project/actions'
import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";
import { Project } from "../interfaces";

export interface Props {
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

  render() {
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

const mapStateToProps = ({projects}) => ({
  projectsOptions: Object.values(projects.projects).map((project: Project) => {
    return {
      key:  project.id,
      text: project.name,
    }
  }),
})


export default connect(mapStateToProps, { loadUserProjects })(ImportView)
