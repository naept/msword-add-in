import * as React from "react";
import { connect } from 'react-redux'
import { NavOption } from "../interfaces";
import SettingsView from "./SettingsView";

export interface Props {
  currentNav: NavOption
}

export interface State {
}

class MainView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    if (this.props.currentNav == NavOption.Settings) {
      return (
        <SettingsView/>
      )
    }

    return (
      <div></div>
    )
  }
}

const mapStateToProps = ({nav}) => ({
  currentNav: nav.nav
})

export default connect(mapStateToProps)(MainView)
