import * as React from "react";
import { GlobalContext } from "../context/GlobalContext";
import { NavOption } from "../interfaces";
import { CommandBar as CommandBarBase, ICommandBarItemProps } from "office-ui-fabric-react";

export interface Props {}

export interface State {}

class CommandBar extends React.Component<Props, State> {
  static contextType = GlobalContext;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _farItems: ICommandBarItemProps[] = [
    {
      key: "settings",
      text: "Settings",
      ariaLabel: "Settings",
      iconOnly: true,
      iconProps: { iconName: "Settings" },
      onClick: () => {
        const navStore = this.context.navStore;
        navStore.setNav(NavOption.Settings);
      }
    }
  ];

  _items: ICommandBarItemProps[] = [
    {
      key: "home",
      text: "Home",
      ariaLabel: "Home",
      iconProps: { iconName: "Home" },
      onClick: () => {
        const navStore = this.context.navStore;
        navStore.setNav(NavOption.Main);
      }
    }
  ];

  componentDidMount() {}

  render() {
    return <CommandBarBase items={this._items} farItems={this._farItems}></CommandBarBase>;
  }
}

export default CommandBar;
