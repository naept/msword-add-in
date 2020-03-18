import * as React from "react";
import NavStore from '../store/NavStore'
import { NavOption } from "../interfaces";
import { connect } from 'react-redux'
// import { subscribe } from 'redux-subscriber';
import { loadUserProjects, loadProjectDocuments } from '../store/project/actions'
import { ComboBox, IComboBoxOption, Stack, Label, Spinner, SpinnerSize, SelectableOptionMenuItemType, TextField } from "office-ui-fabric-react";
import { Project, Document } from "../interfaces";

interface Props {
  navStore: NavStore
  userAuthenticated: boolean
  loadUserProjects: Function
  loadProjectDocuments: Function
  projectsOptions : IComboBoxOption[]
  documentsOptions : IComboBoxOption[]
}

interface State {
  fileName: string
  currentSelection: string
  project: Project
  document: Document
  loadingProjects: boolean
  loadingDocuments: boolean
}

const selectionDivStyle = {
  backgroundColor: 'white',
  border: '1px grey solid',
};

function removeAllTagAttributes(rootElement: Element) {
  rootElement.getAttributeNames().forEach((attributeName) => {
    if (attributeName != "src") {
      rootElement.removeAttribute(attributeName)
    }
  })
  for (var i = 0; i < rootElement.children.length; i++) {
    removeAllTagAttributes(rootElement.children[i])
  }
}

function removeAllTags(rootElement: Element, tagName: string) {
  let elementsToRemove = rootElement.getElementsByTagName(tagName)
  for (var i = 0; i < elementsToRemove.length; i++) {
    elementsToRemove[i].remove()
  }
}

function reduceSingleChildDivs(rootElement: Element) {
  let childrenElements = rootElement.children
  if (childrenElements.length > 1) {
    for (var i = 0; i < childrenElements.length; i++) {
      reduceSingleChildDivs(childrenElements[i])
    }
  } else if (childrenElements.length == 1) {
    if (rootElement.tagName.toLowerCase() == "div") {
      let parentElement = rootElement.parentElement
      if (parentElement) {
        parentElement.appendChild(childrenElements[0])
        parentElement.removeChild(rootElement)
        // reduceSingleChildDivs(parentElement.children[0])
        reduceSingleChildDivs(parentElement)
      }
    } else {
      reduceSingleChildDivs(childrenElements[0])
    }
  } else {
    if (rootElement.tagName.toLowerCase() == "div") {
      rootElement.remove()
    }
  }
}

function cleanHtmlElement(rootElement: Element) {
  removeAllTagAttributes(rootElement)
  removeAllTags(rootElement, "meta")
  removeAllTags(rootElement, "style")
  reduceSingleChildDivs(rootElement)
}

function getSelection() {
  return Word.run((context) => {
    let selection = context.document.getSelection().getHtml()

    return context.sync().then(() => {
      let inputHtmlObject = document.createElement('div');
      inputHtmlObject.innerHTML = selection.value;
      cleanHtmlElement(inputHtmlObject)
      // let filteredElements = inputHtmlObject.querySelectorAll("p, table")
      // let outputHtmlObject = document.createElement('div');
      // filteredElements.forEach((element) => {
      //     outputHtmlObject.appendChild(element)
      // })
      // return outputHtmlObject.outerHTML
      // return selection.value
      return inputHtmlObject.outerHTML.replace(/<span>/g, "").replace(/<\/span>/g, "")
    })
  })
}

class ImportView extends React.Component<Props, State> {
  private setNav: (nav: NavOption, errorMessage: String) => void

  constructor(props: Props) {
    super(props);
    this.state = {
      fileName: '',
      currentSelection: '',
      project: {
        id: '',
        name: ''
      },
      document: {
        id: '',
        name: ''
      },
      loadingProjects: true,
      loadingDocuments: false,
    }
    this.setNav = this.props.navStore.setNav.bind(this.props.navStore)
  }

  componentDidMount() {
    Office.context.document.getFilePropertiesAsync((asyncResult) => {
      let url = decodeURIComponent(asyncResult.value.url)
      let fileName = url.match(/.*[\\\/](.+?)\./)[1]
      this.setState(() => ({
        fileName: fileName
      }))
    })

    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, () => {  //event: Office.DocumentSelectionChangedEventArgs
      // console.log(event)
      getSelection().then((value) => {
        // console.log(value) 
        this.setState(() => ({
          currentSelection: value
        }))
      })
      


      // event.document.getSelectedDataAsync(Office.CoercionType.Html, (result: Office.AsyncResult<string>) => {
      //   let inputHtmlObject = document.createElement('div');
      //   inputHtmlObject.innerHTML = result.value;
      //   let filteredElements = inputHtmlObject.querySelectorAll("p")
      //   let pictures = []
      //   // Word.run(async (context) => {
      //   //   pictures = context.document.getSelection().inlinePictures.items
      //   // })
      //   filteredElements.forEach((element) => {
      //     element.querySelectorAll("img").forEach((image) => {
      //       if (!image.src.startsWith("data:image/")) {
      //         image.
      //         let fileExtension = image.src.match(/(?:\.([^.]+))?$/)[1]
      //         let base64 = pictures[0].getBase64ImageSrc();
      //         image.src = "data:image/" + fileExtension + ";base64," + base64
      //       }
      //     })
      //   })
      //   let outputHtmlObject = document.createElement('div');
      //   filteredElements.forEach((element) => {
      //       outputHtmlObject.appendChild(element)
      //   })
      //   this.setState(() => ({
      //     currentSelection: outputHtmlObject.outerHTML
      //     // currentSelection: result.value
      //   }))
      // })
    })

    this.props.loadUserProjects()
    .then(() => {
      this.setState(() => ({
        loadingProjects: false
      }))
    })
    .catch((error) => {
      if (error.error === "Unauthenticated.") {
        this.setNav(NavOption.Settings, "Authentication failed. Maybe your API key expired.")
      }
    })
  }

  handleProjectSelectChange = (event, option) => {
    if (event) {
      this.setState((state) => ({
        project: {
          ...state.project,
          id: option.key,
          name: option.text,
        },
        document: {
          ...state.document,
          id: '',
          name: '',
        },
        loadingDocuments: true
      }))
      this.props.loadProjectDocuments(option.key)
      .then(() => {
        this.setState(() => ({
          loadingDocuments: false
        }))
      })
      .catch((error) => {
        console.error(error)
      })
    }
  }

  handleDocumentSelectChange = (event, option) => {
    if (event) {
      this.setState((state) => ({
        document: {
          ...state.document,
          id: option.key,
          name: option.text,
        },
      }))
    }
  }

  renderLoadingProjectsSpinner = () => {
    if (this.state.loadingProjects) {
      return (
        <Spinner size={SpinnerSize.xSmall} />
      )
    } else {
      return null
    }
  }

  renderLoadingDocumentsSpinner = () => {
    if (this.state.loadingDocuments) {
      return (
        <Spinner size={SpinnerSize.xSmall} />
      )
    } else {
      return null
    }
  }

  renderNewDocumentForm = () => {
    if (this.state.document.id == 'addNewDocument') {
      return (
        <Stack>
          <TextField label="Document name" defaultValue={this.state.fileName}/>
          <TextField label="Document description" readOnly multiline rows={8} value={this.state.currentSelection}/>
          <Label>Document description</Label>
          <div style={selectionDivStyle} dangerouslySetInnerHTML={{ __html: this.state.currentSelection }} />
        </Stack>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <section>
        <Stack horizontal={true} verticalAlign='center' tokens={{childrenGap: 10}}>
          <Label>Select a project</Label>
          <this.renderLoadingProjectsSpinner/>
        </Stack>
        <ComboBox
          options={this.props.projectsOptions}
          onChange={this.handleProjectSelectChange}
          text={this.state.project.name}
          disabled={this.state.loadingProjects}
        />

        <Stack horizontal={true} verticalAlign='center' tokens={{childrenGap: 10}}>
          <Label>Select a document</Label>
          <this.renderLoadingDocumentsSpinner/>
        </Stack>
        <ComboBox
          options={this.props.documentsOptions}
          onChange={this.handleDocumentSelectChange}
          text={this.state.document.name}
          disabled={this.state.project.name == '' || this.state.loadingDocuments}
        />

        <this.renderNewDocumentForm/>
      </section>
    )
  }
}

const mapStateToProps = ({projects}) => ({
  projectsOptions: Object.values(projects.projects)
  .map((project: Project) => {
    return {
      key:  project.id,
      text: project.name,
    }
  }),

  documentsOptions: Object.values(projects.documents)
  .map((document: Document) => {
    return {
      key:  document.id,
      text: document.name,
      itemType: SelectableOptionMenuItemType.Normal
    }
  })
  .concat([
    {
      key:  'divider',
      text: '-',
      itemType: SelectableOptionMenuItemType.Divider
    },
    {
      key:  'addNewDocument',
      text: 'Add new document',
      itemType: SelectableOptionMenuItemType.Normal
    },
  ]),
})

export default connect(mapStateToProps, { loadUserProjects, loadProjectDocuments })(ImportView)
