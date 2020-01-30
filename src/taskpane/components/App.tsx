import * as React from "react";
import Header from "./Header";
import Progress from "./Progress";
import LoginForm from "./LoginForm";
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

  renderLoginForm = () => {
    if (store.getState().auth.token == '') {
      return <LoginForm/>
    } else {
      return null
    }
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
        <div className="ms-welcome">
          <p>{ store.getState().auth.token }</p>
          <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
          <this.renderLoginForm/>
        </div>
      </Provider>
    );
  }
}

export default App
