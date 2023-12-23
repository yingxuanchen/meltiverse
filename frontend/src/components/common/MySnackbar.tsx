import { Alert, AlertColor, Snackbar } from "@mui/material";

interface Props {
  message: string;
  severity: AlertColor;
  open: boolean;
  onClose: () => void;
}

const MySnackbar = (props: Props) => {
  const { message, severity, open, onClose } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MySnackbar;
