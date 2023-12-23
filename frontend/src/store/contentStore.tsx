import React, { createContext, useContext, useEffect, useReducer } from "react";
import { sidebarStore } from "./sidebarStore";

type ContentType = "VIEW_MATERIAL" | "VIEW_TAG";

interface ContentState {
  contentType?: ContentType | null;
  materialId?: number | null;
  tagId?: number | null;
}

interface Action {
  type: "CHANGE_CONTENT" | "SET_MATERIAL";
  payload: ContentState;
}

const initialState = {
  contentType: null,
  materialId: null,
  tagId: null,
  material: null,
};

const contentStore = createContext<{
  state: ContentState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const { Provider } = contentStore;

const reducer = (state: ContentState, action: Action) => {
  validateAction(action);

  switch (action.type) {
    case "CHANGE_CONTENT":
      if (action.payload.contentType === "VIEW_MATERIAL") {
        return {
          ...state,
          ...action.payload,
          tagId: null,
        };
      } else if (action.payload.contentType === "VIEW_TAG") {
        return {
          ...state,
          ...action.payload,
          materialId: null,
        };
      } else {
        return {
          ...initialState,
        };
      }
    case "SET_MATERIAL":
      return {
        ...state,
        materialId: action.payload.materialId,
      };
    default:
      throw new Error("wrong reducer action");
  }
};

function validateAction(action: Action) {
  const { contentType, materialId, tagId } = action.payload;
  switch (contentType) {
    case "VIEW_MATERIAL":
      if (materialId === null) {
        throw new Error("require materialId");
      }
      break;
    case "VIEW_TAG":
      if (tagId === null) {
        throw new Error("require tagId");
      }
      break;
  }
}

interface Props {
  children: React.ReactNode;
}

const ContentStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { dispatch: sidebarDispatch } = useContext(sidebarStore);

  useEffect(() => {
    if (state.contentType === null) {
      sidebarDispatch({
        type: "OPEN",
      });
    } else {
      sidebarDispatch({
        type: "CLOSE",
      });
    }
  }, [state, sidebarDispatch]);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { contentStore, ContentStateProvider };
