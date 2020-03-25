import * as React from "react";
import { GlobalContext } from "../context/GlobalContext";
import { Stack, TextField, PrimaryButton, Spinner, SpinnerSize, Toggle, MessageBar, MessageBarType } from "office-ui-fabric-react";
import ProjectStore from "../store/ProjectStore";
import Selection from "../app/Selection";
import DisplayHtml from "./DisplayHtml";

interface Props {}

interface State {
  autoRequirementName: boolean;
  requirementName: string;
  requirementDescription: string;
  creatingRequirement: boolean;
  displaySuccessMessageBar: boolean;
  errors: {};
}

export default class NewRequirementForm extends React.Component<Props, State> {
  static contextType = GlobalContext;
  private onChangeSelectionCallbackId: number = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      autoRequirementName: true,
      requirementName: "",
      requirementDescription: "",
      creatingRequirement: false,
      displaySuccessMessageBar: false,
      errors: {}
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
          autoRequirementName: checked,
          displaySuccessMessageBar: false,
          errors: {}
        }),
        () => {
          const selection: Selection = this.context.selection;
          this.handleSelectionChange(selection);
        }
      );
    }
  };

  handleRequirementNameChange = (event, value) => {
    if (event) {
      this.setState(() => ({
        requirementName: value,
        displaySuccessMessageBar: false,
        errors: {}
      }));
    }
  };

  handleSelectionChange = (selection: Selection) => {
    this.setState(() => ({
      requirementName: this.state.autoRequirementName
        ? selection.getSelectionFirstParagraphText()
        : this.state.requirementName,
      requirementDescription: this.state.autoRequirementName
        ? selection.getSelectionLastParagraphsHtml()
        : selection.getSelectionHtml(),
      displaySuccessMessageBar: false,
      errors: {}
    }));
  };

  createDocument = () => {
    const projectStore: ProjectStore = this.context.projectStore;
    this.setState({
      creatingRequirement: true,
      displaySuccessMessageBar: false,
      errors: {}
    });
    return projectStore
      .createRequirementAsync({
        category_id: projectStore.selectedElementLocation.categoryId,
        name: this.state.requirementName,
        description: this.state.requirementDescription
      })
      .then(() => {
        this.setState(() => ({
          displaySuccessMessageBar: true
        }));
      })
      .catch(error => {
        this.setState(() => ({
          errors: error.errors
        }));
        console.error(error);
      })
      .finally(() => {
        this.setState({
          creatingRequirement: false
        });
      });
  };

  render() {
    return (
      <Stack>
        <h2>New Requirement</h2>
        {this.state.displaySuccessMessageBar && <MessageBar messageBarType={MessageBarType.success} >Requirement successfully created</MessageBar>}
        <Toggle
          label="First paragraph is the title"
          checked={this.state.autoRequirementName}
          inlineLabel
          onChange={this.handleToggleChange}
        />
        <TextField
          label="Requirement name"
          value={this.state.requirementName}
          onChange={this.handleRequirementNameChange}
          errorMessage={this.state.errors["name"]}
        />
        <DisplayHtml
          label="Requirement description"
          value={this.state.requirementDescription}
          errorMessage={this.state.errors["description"]}
        />
        <PrimaryButton onClick={this.createDocument}>
          Create requirement
          {this.state.creatingRequirement && <Spinner size={SpinnerSize.xSmall} style={{ marginLeft: "5px" }} />}
        </PrimaryButton>
      </Stack>
    );
  }
}
