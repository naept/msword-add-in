import * as React from "react";
import { connect } from 'react-redux'
import { setNav } from '../store/nav/actions'
import { NavOption } from "../interfaces";
import { CommandBar as CommandBarBase, ICommandBarItemProps } from "office-ui-fabric-react";

export interface Props {
  setNav: Function
}

export interface State {
}

class CommandBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {}
  }
  
  _farItems: ICommandBarItemProps[] = [
    {
      key: 'settings',
      text: 'Settings',
      ariaLabel: 'Settings',
      iconOnly: true,
      iconProps: { iconName: 'Settings' },
      onClick: () => this.props.setNav(NavOption.Settings)
    },
  ]

  _items: ICommandBarItemProps[] = [
    {
      key: 'home',
      text: 'Home',
      ariaLabel: 'Home',
      iconProps: { iconName: 'Home' },
      onClick: () => this.props.setNav(NavOption.Main)
    },
  ]

  componentDidMount() {
  }

  render() {

    return (
      <CommandBarBase
        items={this._items}
        farItems={this._farItems}
      ></CommandBarBase>
    )
  }
}

const mapStateToProps = ({}) => ({
  
})

export default connect(mapStateToProps, { setNav })(CommandBar)
