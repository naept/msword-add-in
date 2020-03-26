import * as React from "react";
import Progress from "./Progress";
import CommandBar from "./CommandBar";
import MainView from "./MainView";
import { GlobalProvider } from "../context/GlobalContext";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
  token: string;
}

export interface AppState {}

class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <GlobalProvider>
        <CommandBar />
        <MainView />
      </GlobalProvider>
    );
  }
}

export default App;
