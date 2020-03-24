import * as React from "react";
import { GlobalContext } from "../context/GlobalContext";
import SelectionOverview from "./SelectionOverview";
import { Stack, TextField, PrimaryButton, Spinner, SpinnerSize } from "office-ui-fabric-react";
import ProjectStore from "../store/ProjectStore";

interface Props {}

interface State {
  categoryName: string;
  categoryDescription: string;
  creatingCategory: boolean;
}

export default class NewCategoryForm extends React.Component<Props, State> {
  static contextType = GlobalContext;

  constructor(props: Props) {
    super(props);
    this.state = {
      categoryName: "",
      categoryDescription: "",
      creatingCategory: false
    };
  }

  componentDidMount() {}

  handleCategoryNameChange = (event, value) => {
    if (event) {
      this.setState(() => ({
        categoryName: value
      }));
    }
  };

  handleCategoryDescriptionChange = (event, value) => {
    if (event) {
      this.setState(() => ({
        categoryDescription: value
      }));
    }
  };

  createDocument = () => {
    const projectStore: ProjectStore = this.context.projectStore;
    this.setState({
      creatingCategory: true
    });
    return projectStore
      .createCategoryAsync({
        id: null,
        document_id: projectStore.selectedElementLocation.documentId,
        name: this.state.categoryName,
        description: this.state.categoryDescription
      })
      .then(() => {
        this.setState({
          creatingCategory: true
        });
      });
  };

  render() {
    return (
      <Stack>
        <h2>New Category</h2>
        <TextField label="Category name" value={this.state.categoryName} onChange={this.handleCategoryNameChange} />
        <SelectionOverview label="Category description" onChange={this.handleCategoryDescriptionChange} />
        <PrimaryButton onClick={this.createDocument}>
          Create category
          {this.state.creatingCategory && <Spinner size={SpinnerSize.xSmall} style={{ marginLeft: "5px" }} />}
        </PrimaryButton>
      </Stack>
    );
  }
}
