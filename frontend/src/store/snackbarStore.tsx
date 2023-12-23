import React, { SetStateAction, createContext, useState } from "react";
import MySnackbar from "../components/common/MySnackbar";
import { AlertColor } from "@mui/material";

interface SnackbarState {
  message?: string;
  severity?: AlertColor;
  open: boolean;
}

const initialState = {
  open: false,
};

const snackbarStore = createContext<{
  snackbar: SnackbarState;
  setSnackbar: React.Dispatch<SetStateAction<SnackbarState>>;
}>({ snackbar: initialState, setSnackbar: () => null });

const { Provider } = snackbarStore;

interface Props {
  children: React.ReactNode;
}

const SnackbarProvider: React.FC<Props> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>(initialState);
  const { message, severity, open } = snackbar;

  const handleClose = () => {
    setSnackbar(initialState);
  };

  return (
    <Provider value={{ snackbar, setSnackbar }}>
      {message && severity && (
        <MySnackbar
          message={message}
          severity={severity}
          open={open}
          onClose={handleClose}
        />
      )}
      {children}
    </Provider>
  );
};

export { snackbarStore, SnackbarProvider };
