import * as React from "react";
import { NavOption } from "../interfaces";
import SettingsView from "./SettingsView";
import ImportView from "./ImportView";
import NavStore from "../store/NavStore";

interface Props {
  navStore: NavStore
}

interface State {
  currentNav: NavOption
}

class MainView extends React.Component<Props, State> {

  // private store: NavStore = new NavStore()

  constructor(props: Props) {
    super(props);
    this.state = {
      currentNav: this.props.navStore.nav
    }
    // On souscrit aux changements du store
    this.props.navStore.onChange((store) => {
      this.setState({ currentNav: store.nav })
    })
  }

  componentDidMount() {
  }

  render() {
    let {currentNav} = this.state
    if (currentNav == NavOption.Settings) {
      return (
        <SettingsView/>
      )
    } else if (currentNav == NavOption.Main) {
      return (
        <ImportView/>
      )
    }

    return (
      <div></div>
    )
  }
}

export default MainView
