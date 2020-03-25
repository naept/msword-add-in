import * as React from "react";
import { NavOption } from "../interfaces";
import SettingsView from "./SettingsView";
import ImportView from "./ImportView";
import { GlobalContext } from "../context/GlobalContext";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import NavStore from "../store/NavStore";

interface Props {}

interface State {
  currentNav: NavOption;
  errorMessage: String;
}

class MainView extends React.Component<Props, State> {
  static contextType = GlobalContext;

  private onChangeNavStoreCallbackId: number = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentNav: NavOption.Main,
      errorMessage: ""
    };
  }

  componentDidMount() {
    const navStore: NavStore = this.context.navStore;
    // On souscrit aux changements du store
    this.onChangeNavStoreCallbackId = navStore.onChange(store => {
      this.setState({
        currentNav: store.nav,
        errorMessage: store.errorMessage
      });
    });
  }

  componentWillUnmount() {
    const navStore: NavStore = this.context.navStore;
    navStore.onChangeUnsubscribe(this.onChangeNavStoreCallbackId);
  }

  render() {
    let { currentNav, errorMessage } = this.state;

    return (
      <div>
        {errorMessage && <MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>}
        {currentNav === NavOption.Settings ? <SettingsView /> : <ImportView />}
      </div>
    );
  }
}

export default MainView;
