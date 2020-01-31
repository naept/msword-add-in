import * as React from "react";
import Progress from "./Progress";
import LoginForm from "./LoginForm";
import ImportView from "./ImportView";
import { Provider } from 'react-redux';
import store from '../store';

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
  token: string
}

export interface AppState {
}

class App extends React.Component<AppProps, AppState> {

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
      <Provider store={store}>
        <LoginForm/>
        
        <ImportView/>
      </Provider>
    );
  }
}

export default App
