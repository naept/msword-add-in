import * as React from "react";
import ElementSelector from "./ElementSelector";
import NewDocumentForm from "./NewDocumentForm";
import { ElementLocation } from "../interfaces";
import ProjectStore from "../store/ProjectStore";
import { GlobalContext } from "../context/GlobalContext";
import NewCategoryForm from "./NewCategoryForm";

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
        categoryId: "",
        requirementId: ""
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
      </section>
    );
  }
}
