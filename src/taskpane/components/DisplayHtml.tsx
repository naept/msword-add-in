import * as React from "react";
// import { Stack, Label, TextField } from "office-ui-fabric-react";
import { Stack, Label } from "office-ui-fabric-react";

interface Props {
  label?: string;
  value: string
}

interface State {
}

const selectionDivStyle = {
  backgroundColor: "white",
  border: "1px grey solid",
  paddingLeft: "7px",
  paddingRight: "7px",
  minHeight: "250px",
  maxHeight: "500px",
  overflow: "auto"
};

export default class DisplayHtml extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Stack>
        {this.props.label && <Label>{this.props.label}</Label>}
        <div style={selectionDivStyle} dangerouslySetInnerHTML={{ __html: this.props.value }} />
        {/* <TextField label="Html :" readOnly multiline rows={8} value={this.props.value} /> */}
      </Stack>
    );
  }
}
