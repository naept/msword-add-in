import * as React from "react";
import { ElementLocation } from "../interfaces";
import { GlobalContext } from "../context/GlobalContext";
import ElementSelector from "./ElementSelector";
import NewDocumentForm from "./NewDocumentForm";
import ProjectStore from "../store/ProjectStore";
import NewCategoryForm from "./NewCategoryForm";
import NewRequirementForm from "./NewRequirementForm";

interface Props {}

interface State {
  selectedElementLocation: ElementLocation;
}

export default class ImportView extends React.Component<Props, State> {
  static contextType = GlobalContext;

  private onChangeProjectStoreCallbackId: number = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedElementLocation: {
        projectId: "",
        documentId: "",
        categoryId: ""
      }
    };
  }

  componentDidMount() {
    // On souscrit aux changements du projectStore
    const projectStore: ProjectStore = this.context.projectStore;
    this.onChangeProjectStoreCallbackId = projectStore.onChange(store => {
      this.setState({
        selectedElementLocation: store.selectedElementLocation
      });
    });
  }

  componentWillUnmount() {
    const projectStore: ProjectStore = this.context.projectStore;
    projectStore.onChangeUnsubscribe(this.onChangeProjectStoreCallbackId);
  }

  render() {
    return (
      <section>
        <ElementSelector />
        {this.state.selectedElementLocation.documentId === "addNewDocument" && <NewDocumentForm />}
        {this.state.selectedElementLocation.categoryId === "addNewCategory" && <NewCategoryForm />}
        {this.state.selectedElementLocation.categoryId !== "" &&
          this.state.selectedElementLocation.categoryId !== "addNewCategory" && <NewRequirementForm />}
      </section>
    );
  }
}
