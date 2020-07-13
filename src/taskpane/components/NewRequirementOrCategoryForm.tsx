import * as React from "react";
import { GlobalContext } from "../context/GlobalContext";
import {
  Stack,
  TextField,
  CompoundButton,
  Spinner,
  SpinnerSize,
  Toggle,
  MessageBar,
  MessageBarType,
  Separator
} from "office-ui-fabric-react";
import ProjectStore from "../store/ProjectStore";
import Selection from "../app/Selection";
import DisplayHtml from "./DisplayHtml";

interface Props {}

interface State {
  autoName: boolean;
  elementName: string;
  elementDescription: string;
  creatingRequirement: boolean;
  creatingCategory: boolean;
  creatingCategoryInParent: boolean;
  displaySuccessMessageBar: boolean;
  errors: {};
}

export default class NewRequirementOrCategoryForm extends React.Component<Props, State> {
  static contextType = GlobalContext;
  private onChangeSelectionCallbackId: number = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      autoName: true,
      elementName: "",
      elementDescription: "",
      creatingRequirement: false,
      creatingCategory: false,
      creatingCategoryInParent: false,
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
          autoName: checked,
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

  handleElementNameChange = (event, value) => {
    if (event) {
      this.setState(() => ({
        elementName: value,
        displaySuccessMessageBar: false,
        errors: {}
      }));
    }
  };

  handleSelectionChange = (selection: Selection) => {
    this.setState(() => ({
      elementName: this.state.autoName ? selection.getSelectionFirstParagraphText() : this.state.elementName,
      elementDescription: this.state.autoName
        ? selection.getSelectionLastParagraphsHtml()
        : selection.getSelectionHtml(),
      displaySuccessMessageBar: false,
      errors: {}
    }));
  };

  createRequirement = () => {
    const projectStore: ProjectStore = this.context.projectStore;
    this.setState({
      creatingRequirement: true,
      displaySuccessMessageBar: false,
      errors: {}
    });
    const requirement = {
      document_id: projectStore.selectedElementLocation.documentId,
      category_id: null,
      name: this.state.elementName,
      description: this.state.elementDescription,
    }
    if (projectStore.selectedElementLocation.categoryId !== "") {
      requirement.category_id = projectStore.selectedElementLocation.categoryId
    }
    return projectStore
      .createRequirementAsync(requirement)
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

  createCategory = () => {
    const projectStore: ProjectStore = this.context.projectStore;
    this.setState({
      creatingCategory: true,
      displaySuccessMessageBar: false,
      errors: {}
    });
    return projectStore
      .createCategoryAsync({
        id: null,
        document_id: projectStore.selectedElementLocation.documentId,
        parent_id: projectStore.selectedElementLocation.categoryId,
        name: this.state.elementName,
        description: this.state.elementDescription,
        _lft: null,
        _rgt: null
      })
      .catch(error => {
        this.setState(() => ({
          errors: error.errors
        }));
        console.error(error);
      })
      .finally(() => {
        this.setState({
          creatingCategory: false
        });
      });
  };

  createCategoryInParent = () => {
    const projectStore: ProjectStore = this.context.projectStore;
    this.setState({
      creatingCategoryInParent: true,
      displaySuccessMessageBar: false,
      errors: {}
    });
    return projectStore
      .createCategoryAsync({
        id: null,
        document_id: projectStore.selectedElementLocation.documentId,
        parent_id: projectStore.categories[projectStore.selectedElementLocation.categoryId].parent_id,
        name: this.state.elementName,
        description: this.state.elementDescription,
        _lft: null,
        _rgt: null
      })
      .catch(error => {
        this.setState(() => ({
          errors: error.errors
        }));
        console.error(error);
      })
      .finally(() => {
        this.setState({
          creatingCategoryInParent: false
        });
      });
  };

  render() {
    const projectStore: ProjectStore = this.context.projectStore;
    const selectedDocumentId = projectStore.selectedElementLocation.documentId;
    const selectedDocumentName = projectStore.documents[selectedDocumentId].name;
    const selectedCategoryId = projectStore.selectedElementLocation.categoryId;
    const selectedCategoryName = (projectStore.categories[selectedCategoryId] || {}).name;
    const selectedCategoryParentId = (projectStore.categories[selectedCategoryId] || {}).parent_id;
    const selectedCategoryParentName = (projectStore.categories[selectedCategoryParentId] || {}).name;
    return (
      <Stack>
        <h2>New Requirement or Category</h2>
        {this.state.displaySuccessMessageBar && (
          <MessageBar messageBarType={MessageBarType.success}>Requirement successfully created</MessageBar>
        )}
        <Toggle
          label="First paragraph is the title"
          checked={this.state.autoName}
          inlineLabel
          onChange={this.handleToggleChange}
        />
        <TextField
          label="Element name"
          value={this.state.elementName}
          onChange={this.handleElementNameChange}
          errorMessage={this.state.errors["name"]}
        />
        <DisplayHtml
          label="Element description"
          value={this.state.elementDescription}
          errorMessage={this.state.errors["description"]}
        />
        <Stack tokens={{ childrenGap: 10 }}>
          <CompoundButton primary onClick={this.createRequirement}
            text={selectedCategoryId === "" ? `Create requirement (in document)` : `Create requirement (in category)`}
            secondaryText={selectedCategoryId === "" ? selectedDocumentName : selectedCategoryName}
          >
            {this.state.creatingRequirement && <Spinner size={SpinnerSize.xSmall} style={{ marginLeft: "5px" }} />}
          </CompoundButton>
          <Separator>Or</Separator>
          <CompoundButton primary onClick={this.createCategory}
            text={selectedCategoryId === "" ? `Create category (in document)` : `Create sub-category (in category)`}
            secondaryText={selectedCategoryId === "" ? selectedDocumentName : selectedCategoryName}
          >
            {this.state.creatingCategory&& <Spinner size={SpinnerSize.xSmall} style={{ marginLeft: "5px" }} />}
          </CompoundButton>

          {selectedCategoryId !== "" && (
            <Separator>Or</Separator>
          )}
          {selectedCategoryId !== "" && (
            <CompoundButton primary onClick={this.createCategoryInParent}
              text={selectedCategoryParentId === null ? `Create category (in document)` : `Create sub-category (in category)`}
              secondaryText={selectedCategoryParentId === null ? selectedDocumentName : selectedCategoryParentName}
            >
              {this.state.creatingCategoryInParent && <Spinner size={SpinnerSize.xSmall} style={{ marginLeft: "5px" }} />}
            </CompoundButton>
          )}

        </Stack>
      </Stack>
    );
  }
}
