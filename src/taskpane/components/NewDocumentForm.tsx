import * as React from "react";
import Selection from '../app/Selection'
import { Stack, Label, TextField } from "office-ui-fabric-react";

interface Props {
}

interface State {
    fileName: string
    currentSelection: string
}

const selectionDivStyle = {
  backgroundColor: 'white',
  border: '1px grey solid',
};

export default class NewDocumentForm extends React.Component<Props, State> {
    private selection: Selection = new Selection()
  
    constructor(props: Props) {
        super(props);
        this.state = {
            fileName: '',
            currentSelection: '',
        }
    }

    componentDidMount() {
      Office.context.document.getFilePropertiesAsync((asyncResult) => {
        let url = decodeURIComponent(asyncResult.value.url)
        console.log(url)
        let fileName = url.match(/.*[\\\/](.+?)\./)[1]
        this.setState(() => ({
          fileName: fileName
        }))
      })
  
      Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, () => {  //event: Office.DocumentSelectionChangedEventArgs
        this.selection.getSelectionHtml().then((value) => {
          this.setState(() => ({
            currentSelection: value
          }))
        })
      })
    }

    handleDocumentNameChange = (event, value) => {
        if (event) {
            console.log("event", event)
            console.log("option", value)
            this.setState(() => ({
                fileName: value,
            }))
        }
    }
    
    render() {
        return (
            <Stack>
                <TextField label="Document name" value={this.state.fileName} onChange={this.handleDocumentNameChange}/>
                <TextField label="Document description" readOnly multiline rows={8} value={this.state.currentSelection}/>
                <Label>Document description</Label>
                <div style={selectionDivStyle} dangerouslySetInnerHTML={{ __html: this.state.currentSelection }} />
            </Stack>
        )
    }
}