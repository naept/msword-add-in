import * as React from "react";
import NavStore from "../store/NavStore";
import ProjectStore from "../store/ProjectStore";
import Selection from "../app/Selection";

export const GlobalContext = React.createContext({});

export const GlobalProvider = (props: any) => {
  const navStore: NavStore = new NavStore();
  const projectStore: ProjectStore = new ProjectStore();
  const selection: Selection = new Selection();
  return <GlobalContext.Provider value={{navStore, projectStore, selection}}>{props.children}</GlobalContext.Provider>;
};
