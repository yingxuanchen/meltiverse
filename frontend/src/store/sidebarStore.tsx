import React, { createContext, useReducer } from "react";

interface SidebarState {
  open: boolean;
  toRefresh: boolean;
}

interface Action {
  type: "OPEN" | "CLOSE" | "REFRESH" | "DONE_REFRESH";
}

const initialState = {
  open: true,
  toRefresh: false,
};

const sidebarStore = createContext<{
  state: SidebarState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const { Provider } = sidebarStore;

const reducer = (state: SidebarState, action: Action) => {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        open: true,
      };
    case "CLOSE":
      return {
        ...state,
        open: false,
      };
    case "REFRESH":
      return {
        ...state,
        toRefresh: true,
      };
    case "DONE_REFRESH":
      return {
        ...state,
        toRefresh: false,
      };
    default:
      throw new Error("wrong reducer action");
  }
};

interface Props {
  children: React.ReactNode;
}

const SidebarStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { sidebarStore, SidebarStateProvider };
