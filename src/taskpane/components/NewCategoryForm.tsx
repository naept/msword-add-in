import * as React from "react";
import { GlobalContext } from "../context/GlobalContext";
import { Stack, TextField, PrimaryButton, Spinner, SpinnerSize, Toggle } from "office-ui-fabric-react";
import ProjectStore from "../store/ProjectStore";
import Selection from "../app/Selection";
import DisplayHtml from "./DisplayHtml";

interface Props {}

interface State {
  autoCategoryName: boolean;
  categoryName: string;
  categoryDescription: string;
  creatingCategory: boolean;
}

export default class NewCategoryForm extends React.Component<Props, State> {
  static contextType = GlobalContext;
  private onChangeSelectionCallbackId: number = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      autoCategoryName: true,
      categoryName: "",
      categoryDescription: "",
      creatingCategory: false
    };
  }

  componentDidMount() {
    const selection: Selection = this.context.selection;
    this.onChangeSelectionCallbackId = selection.onChange(selection => {
      this.handleSelectionChange(selection);
    });
    this.handleSelectionChange(selection);
  }

  componentWillUnmount() {
    const selection: Selection = this.context.selection;
    selection.onChangeUnsubscribe(this.onChangeSelectionCallbackId);
  }

  handleToggleChange = (event: React.MouseEvent<HTMLElement>, checked: boolean) => {
    if (event) {
      this.setState(
        () => ({
          autoCategoryName: checked
        }),
        () => {
          const selection: Selection = this.context.selection;
          this.handleSelectionChange(selection);
        }
      );
    }
  };

  handleCategoryNameChange = (event, value) => {
    if (event) {
      this.setState(() => ({
        categoryName: value
      }));
    }
  };

  handleSelectionChange = (selection: Selection) => {
    this.setState(() => ({
      categoryName: this.state.autoCategoryName ? selection.getSelectionFirstParagraphText() : this.state.categoryName,
      categoryDescription: this.state.autoCategoryName
        ? selection.getSelectionLastParagraphsHtml()
        : selection.getSelectionHtml()
    }));
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
        <Toggle
          label="First paragraph is the title"
          checked={this.state.autoCategoryName}
          inlineLabel
          onChange={this.handleToggleChange}
        />
        <TextField label="Category name" value={this.state.categoryName} onChange={this.handleCategoryNameChange} />
        <DisplayHtml label="Category description" value={this.state.categoryDescription} />
        <PrimaryButton onClick={this.createDocument}>
          Create category
          {this.state.creatingCategory && <Spinner size={SpinnerSize.xSmall} style={{ marginLeft: "5px" }} />}
        </PrimaryButton>
      </Stack>
    );
  }
}
