import * as React from "react";
import NavStore from "../store/NavStore";

export const NavContext = React.createContext(new NavStore());

export const NavProvider = props => {
  const navStore = new NavStore();
  return <NavContext.Provider value={navStore}>{props.children}</NavContext.Provider>;
};
