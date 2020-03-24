import * as React from "react";
import { GlobalContext } from "../context/GlobalContext";
import SelectionOverview from "./SelectionOverview";
import { Stack, TextField, PrimaryButton } from "office-ui-fabric-react";

interface Props {
  project_id: string;
}

interface State {
  documentName: string;
  documentDescription: string;
}

export default class NewDocumentForm extends React.Component<Props, State> {
  static contextType = GlobalContext;

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

  createDocument = () => {
    const projectStore = this.context.projectStore;
    return projectStore.createDocumentAsync({
      project_id: this.props.project_id,
      name: this.state.documentName,
      description: this.state.documentDescription
    });
    // return NaeptApi.fetchNaeptApi("documents", {
    //   method: 'POST',
    //   body: JSON.stringify({
    //       project_id: this.props.project_id,
    //       name: this.state.documentName,
    //       description: this.state.documentDescription,
    //   })
    // })
  };

  render() {
    return (
      <Stack>
        <TextField label="Document name" value={this.state.documentName} onChange={this.handleDocumentNameChange} />
        <SelectionOverview label="Document description" onChange={this.handleDocumentDescriptionChange} />
        <PrimaryButton text="Create document" onClick={this.createDocument} />
      </Stack>
    );
  }
}
