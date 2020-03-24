import * as React from "react";
import Selection from "../app/Selection";
import { Stack, Label, TextField } from "office-ui-fabric-react";
// import { Stack, Label } from "office-ui-fabric-react";

interface Props {
  label?: string;
  name?: string;
  onChange?: (event: {}, newValue?: string) => void;
}

interface State {
  currentSelection: string;
}

const selectionDivStyle = {
  backgroundColor: "white",
  border: "1px grey solid",
  paddingLeft: "7px",
  paddingRight: "7px",
  minHeignt: "250px",
  maxHeignt: "500px",
  overflow: "auto"
};

export default class SelectionOverview extends React.Component<Props, State> {
  private selection: Selection = new Selection();

  constructor(props: Props) {
    super(props);
    this.state = {
      currentSelection: ""
    };
  }

  componentDidMount() {
    this.selection.onChange(selection => {
      let value = selection.getSelectionHtml();
      this.setState({
        currentSelection: value
      });
      this.props.onChange(
        {
          target: {
            name: this.props.name,
            value: value,
            selection: selection
          }
        },
        value
      );
    });
  }

  render() {
    return (
      <Stack>
        {this.props.label && <Label>{this.props.label}</Label>}
        <div style={selectionDivStyle} dangerouslySetInnerHTML={{ __html: this.state.currentSelection }} />
        <TextField label="Html :" readOnly multiline rows={8} value={this.state.currentSelection} />
      </Stack>
    );
  }
}
