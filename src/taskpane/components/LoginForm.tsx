import * as React from "react";
import { DefaultButton, TextField, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { connect } from 'react-redux'
import { login } from '../store/auth/actions'
// import { AuthState } from '../store/auth/interfaces'
// import store from "../store";

export interface Props {
  token: string,
  login: Function,
}

export interface State {
  email: string,
  password: string,
  error: boolean,
}

class LoginForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: false,
    }
  }

  clickOnLogin = () => {
    this.props.login({
      email:    this.state.email,
      password: this.state.password,
    })
    .then(() => {
      this.setState({
        ...this.state,
        error: false
      })
    })
    .catch((errors: any) => {
      this.setState({
        ...this.state,
        error: true
      })
      console.error(errors)
    })
  }

  handleEmailChange = (event) => {
    this.setState({
      ...this.state,
      email: event.target.value
    })
  }

  handlePasswordChange = (event) => {
    this.setState({
      ...this.state,
      password: event.target.value
    })
  }

  renderConnexionError = () => {
    if (this.state.error) {
      return (
        <MessageBar messageBarType={MessageBarType.error} isMultiline={false} >
          Those credentials are incorrect.
        </MessageBar>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <section>
        <this.renderConnexionError/>
        <TextField label="Email" type='email' value={this.state.email} onChange={this.handleEmailChange} />
        <TextField label="Password" type='password' value={this.state.password} onChange={this.handlePasswordChange} />
        <br/>
        <DefaultButton className="ms-Grid-col ms-sm4 ms-smPush8" onClick={ this.clickOnLogin }>Login</DefaultButton>
        <p>{ this.props.token }</p>
      </section>
    )
  }
}

const mapStateToProps = ({auth}) => ({
    token: auth.token
})

export default connect(mapStateToProps, { login })(LoginForm)
