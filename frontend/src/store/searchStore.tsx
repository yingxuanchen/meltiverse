import React, { createContext, useReducer } from "react";

interface SearchState {
  materialInput?: string;
  materialData?: any | null;
  tagInput?: string;
  tagData?: any | null;
}

interface Action {
  type: "SEARCH_MATERIAL" | "SEARCH_TAG";
  payload: SearchState;
}

const initialState = {
  materialInput: "",
  materialData: null,
  tagInput: "",
  tagData: null,
};

const searchStore = createContext<{
  state: SearchState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const { Provider } = searchStore;

const reducer = (state: SearchState, action: Action) => {
  switch (action.type) {
    case "SEARCH_MATERIAL":
      return {
        ...state,
        materialInput: action.payload.materialInput,
        materialData: action.payload.materialData,
      };
    case "SEARCH_TAG":
      return {
        ...state,
        tagInput: action.payload.tagInput,
        tagData: action.payload.tagData,
      };
    default:
      throw new Error("wrong reducer action");
  }
};

interface Props {
  children: React.ReactNode;
}

const SearchStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { searchStore, SearchStateProvider };
