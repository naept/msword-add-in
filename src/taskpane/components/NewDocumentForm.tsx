import * as React from "react";
import SelectionOverview from "./SelectionOverview";
import { Stack, TextField } from "office-ui-fabric-react";

interface Props {}

interface State {
  documentName: string;
  documentDescription: string;
}

export default class NewDocumentForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      documentName: "",
      documentDescription: ""
    };
  }

  componentDidMount() {
    Office.context.document.getFilePropertiesAsync(asyncResult => {
      let url = decodeURIComponent(asyncResult.value.url);
      console.log(url);
      let documentName = url.match(/.*[\\\/](.+?)\./)[1];
      this.setState(() => ({
        documentName: documentName
      }));
    });
  }

  handleDocumentNameChange = (event, value) => {
    if (event) {
      this.setState(() => ({
        documentName: value
      }));
    }
  };

  handleDocumentDescriptionChange = (event, value) => {
    if (event) {
      this.setState(() => ({
        documentDescription: value
      }));
    }
  };

  render() {
    return (
      <Stack>
        <TextField label="Document name" value={this.state.documentName} onChange={this.handleDocumentNameChange} />
        <SelectionOverview label="Document description" onChange={this.handleDocumentDescriptionChange} />
      </Stack>
    );
  }
}
