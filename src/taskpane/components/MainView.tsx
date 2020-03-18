import * as React from "react";
import { NavOption } from "../interfaces";
import SettingsView from "./SettingsView";
import ImportView from "./ImportView";
import NavStore from "../store/NavStore";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";

interface Props {
  navStore: NavStore
}

interface State {
  currentNav: NavOption
  errorMessage: String
}

class MainView extends React.Component<Props, State> {

  // private store: NavStore = new NavStore()

  constructor(props: Props) {
    super(props);
    this.state = {
      currentNav: this.props.navStore.nav,
      errorMessage: this.props.navStore.errorMessage
    }
    // On souscrit aux changements du store
    this.props.navStore.onChange((store) => {
      this.setState({
        currentNav: store.nav,
        errorMessage: store.errorMessage
      })
    })
  }

  componentDidMount() {
  }

  render() {
    let {currentNav, errorMessage} = this.state

    return (
      <div>
        {errorMessage &&
        <MessageBar messageBarType={MessageBarType.error}>
          { errorMessage }
        </MessageBar>
        }
        {currentNav === NavOption.Settings
          ? <SettingsView/>
          : <ImportView navStore={this.props.navStore}/>
        }
      </div>
    )
  }
}

export default MainView
