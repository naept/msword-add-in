import * as React from "react";
import { DefaultButton, TextField, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { connect } from 'react-redux'
import { login, logout } from '../store/auth/actions'

export interface Props {
  token: string,
  userName: string,
  login: Function,
  logout: Function,
}

export interface State {
  email: string,
  password: string,
  error: boolean,
}

class LoginForm extends React.Component<Props, State> {
  constructor(props: Props) {
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

  clickOnLogout = () => {
    this.props.logout()
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

  renderConnexionForm = () => {
    if (this.props.token == "") {
      return (
        <div>
          <TextField label="Email" type='email' value={this.state.email} onChange={this.handleEmailChange} />
          <TextField label="Password" type='password' value={this.state.password} onChange={this.handlePasswordChange} />
          <br/>
          <DefaultButton onClick={ this.clickOnLogin }>Login</DefaultButton>
        </div>
      )
    } else {
      return (
        <div>
          <h4>Welcome { this.props.userName }</h4>
          <DefaultButton onClick={ this.clickOnLogout }>Logout</DefaultButton>
        </div>
      )
    }
  }

  render() {
    return (
      <section>
        <this.renderConnexionError/>
        <this.renderConnexionForm/>
      </section>
    )
  }
}

const mapStateToProps = ({auth}) => ({
    token: auth.token,
    userName: auth.user.name,
})

export default connect(mapStateToProps, { login, logout })(LoginForm)
