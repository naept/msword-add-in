import * as React from "react";
import NavStore from '../store/NavStore'
import { NavOption } from "../interfaces";
import { CommandBar as CommandBarBase, ICommandBarItemProps } from "office-ui-fabric-react";

export interface Props {
  navStore: NavStore
}

export interface State {
}

class CommandBar extends React.Component<Props, State> {
  private setNav: (nav: NavOption) => void

  constructor(props: Props) {
    super(props);
    this.state = {}
    this.setNav = this.props.navStore.setNav.bind(this.props.navStore)
  }
  
  _farItems: ICommandBarItemProps[] = [
    {
      key: 'settings',
      text: 'Settings',
      ariaLabel: 'Settings',
      iconOnly: true,
      iconProps: { iconName: 'Settings' },
      onClick: () => this.setNav(NavOption.Settings),
    },
  ]

  _items: ICommandBarItemProps[] = [
    {
      key: 'home',
      text: 'Home',
      ariaLabel: 'Home',
      iconProps: { iconName: 'Home' },
      onClick: () => this.setNav(NavOption.Main),
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

export default CommandBar
