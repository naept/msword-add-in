import * as React from "react";
import { GlobalContext } from "../context/GlobalContext";
import SelectionOverview from "./SelectionOverview";
import { Stack, TextField, PrimaryButton, Spinner, SpinnerSize } from "office-ui-fabric-react";
import ProjectStore from "../store/ProjectStore";

interface Props {}

interface State {
  documentName: string;
  documentDescription: string;
  creatingDocument: boolean;
}

export default class NewDocumentForm extends React.Component<Props, State> {
  static contextType = GlobalContext;

  constructor(props: Props) {
    super(props);
    this.state = {
      documentName: "",
      documentDescription: "",
      creatingDocument: false
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
    const projectStore: ProjectStore = this.context.projectStore;
    this.setState({
      creatingDocument: true
    });
    return projectStore
      .createDocumentAsync({
        id: null,
        project_id: projectStore.selectedElementLocation.projectId,
        name: this.state.documentName,
        description: this.state.documentDescription
      })
      .then(() => {
        this.setState({
          creatingDocument: true
        });
      });
  };

  render() {
    return (
      <Stack>
        <h2>New Document</h2>
        <TextField label="Document name" value={this.state.documentName} onChange={this.handleDocumentNameChange} />
        <SelectionOverview label="Document description" onChange={this.handleDocumentDescriptionChange} />
        <PrimaryButton onClick={this.createDocument}>
          Create document
          {this.state.creatingDocument && <Spinner size={SpinnerSize.xSmall} style={{ marginLeft: "5px" }} />}
        </PrimaryButton>
      </Stack>
    );
  }
}
