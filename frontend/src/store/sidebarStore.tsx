import React, { createContext, useReducer } from "react";

interface SidebarState {
  open: boolean;
}

interface Action {
  type: "OPEN" | "CLOSE";
}

const initialState = {
  open: true,
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
