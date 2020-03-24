import * as React from "react";
import ElementSelector from "./ElementSelector";
import NewDocumentForm from "./NewDocumentForm";
import { ElementLocation } from "../interfaces";

interface Props {}

interface State {
  selectedElementLocation: ElementLocation;
}

export default class ImportView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedElementLocation: {
        projectId: "",
        documentId: "",
        categoryId: "",
        requirementId: ""
      }
    };
  }

  handleElementSelectChange = value => {
    this.setState(() => ({
      selectedElementLocation: value
    }));
  };

  render() {
    return (
      <section>
        <ElementSelector onChange={this.handleElementSelectChange} />
        {this.state.selectedElementLocation.documentId === "addNewDocument" && <NewDocumentForm project_id={this.state.selectedElementLocation.projectId}/>}
      </section>
    );
  }
}
