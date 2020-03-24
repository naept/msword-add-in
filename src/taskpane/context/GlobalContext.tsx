import * as React from "react";
import NavStore from "../store/NavStore";
import ProjectStore from "../store/ProjectStore";

export const GlobalContext = React.createContext({});

export const GlobalProvider = props => {
  const navStore = new NavStore();
  const projectStore = new ProjectStore();
  return <GlobalContext.Provider value={{navStore, projectStore}}>{props.children}</GlobalContext.Provider>;
};
