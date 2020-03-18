import * as React from "react";
import Progress from "./Progress";
import CommandBar from "./CommandBar";
import MainView from "./MainView";
import NavStore from '../store/NavStore'

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
  token: string
}

export interface AppState {
}

class App extends React.Component<AppProps, AppState> {
  private navStore: NavStore = new NavStore()

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <div>
        <CommandBar navStore={this.navStore}/>
        <MainView navStore={this.navStore}/>
      </div>
    );
  }
}

export default App
