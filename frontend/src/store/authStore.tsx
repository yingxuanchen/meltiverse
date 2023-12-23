import React, { createContext, useReducer } from "react";

interface AuthState {
  loggedIn: boolean;
  userId: number;
  username: string;
  role: string;
  jwt: string;
}

interface Action {
  type: "LOGIN" | "LOGOUT";
  payload?: AuthState | any;
}

const emptyState = {
  loggedIn: false,
  userId: null,
  username: "",
  role: "",
  jwt: "",
};

const getInitialState = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    return {
      loggedIn: true,
      userId: user.userId,
      username: user.username,
      role: user.role,
      jwt: user.jwt,
    };
  } else {
    return {
      ...emptyState,
    };
  }
};

const authStore = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<Action>;
}>({ state: getInitialState(), dispatch: () => null });

const { Provider } = authStore;

const reducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        loggedIn: true,
        ...action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      return {
        ...emptyState,
      };
    default:
      throw new Error("wrong reducer action");
  }
};

interface Props {
  children: React.ReactNode;
}

const AuthStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { authStore, AuthStateProvider };
