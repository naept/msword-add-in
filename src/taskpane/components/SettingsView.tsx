import * as React from "react";
import { TextField, PrimaryButton, Link } from "office-ui-fabric-react";

export interface Props {}

export interface State {
  apiKey: string;
}

class SettingsView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      apiKey: ""
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      apiKey: localStorage.getItem("API_Key")
    });
  }

  handleAPIKeyChange = event => {
    this.setState({
      ...this.state,
      apiKey: event.target.value
    });
  };

  clickOnGenerateAPIKeyLink() {
    window.open("https://app.naept.com/user/applications");
  }

  clickOnValidate = () => {
    localStorage.setItem("API_Key", this.state.apiKey);
  };

  render() {
    return (
      <div>
        <TextField
          label="API Key"
          multiline
          rows={5}
          resizable={false}
          value={this.state.apiKey}
          onChange={this.handleAPIKeyChange}
        />
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <Link className="ms-Grid-col ms-sm8 ms-md9 ms-lg10" onClick={this.clickOnGenerateAPIKeyLink}>
              Generate API Key
            </Link>
            <PrimaryButton
              className="ms-Grid-col ms-sm4 ms-md3 ms-lg2"
              text="Validate"
              onClick={this.clickOnValidate}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsView;
