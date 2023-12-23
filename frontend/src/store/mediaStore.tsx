import React, { createContext, useReducer } from "react";

interface MediaState {
  url?: string | null;
  seconds?: number;
}

interface Action {
  type: "SET_URL" | "CHANGE_TIME";
  payload: MediaState;
}

const initialState = {
  url: "",
  type: null,
  seconds: -1,
};

const mediaStore = createContext<{
  state: MediaState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const { Provider } = mediaStore;

const reducer = (state: MediaState, action: Action) => {
  switch (action.type) {
    case "SET_URL":
      return {
        ...state,
        url: action.payload.url,
        seconds: -1,
      };
    case "CHANGE_TIME":
      return {
        ...state,
        seconds: action.payload.seconds,
      };
    default:
      throw new Error("wrong reducer action");
  }
};

interface Props {
  children: React.ReactNode;
}

const MediaStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { mediaStore, MediaStateProvider };
