import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { ChangeEvent, SyntheticEvent, useContext, useState } from "react";
import useValidateOnTouch from "../../hooks/useValidateOnTouch";
import { requiredRule } from "../../utils/inputValidationRules";
import { snackbarStore } from "../../store/snackbarStore";
import { fetcher } from "../../utils/utils";
import { authStore } from "../../store/authStore";

interface Props {
  onClose: () => void;
}

const Login = (props: Props) => {
  const { onClose } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const { setSnackbar } = useContext(snackbarStore);
  const [contactValue, setContactValue] = useState<string>("");
  const { dispatch: dispatchAuth } = useContext(authStore);

  const {
    value: usernameValue,
    errorMessage: usernameError,
    onChange: onUsernameChange,
    isInputValid: isUsernameValid,
  } = useValidateOnTouch("", [requiredRule("Username")]);
  const {
    value: pwValue,
    errorMessage: pwError,
    onChange: onPwChange,
    isInputValid: isPwValid,
  } = useValidateOnTouch("", [requiredRule("Password")]);

  const handleChangeTab = (event: SyntheticEvent, tabIndex: number) => {
    setTabIndex(tabIndex);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const reqBody = {
      username: usernameValue,
      pw: pwValue,
      contact: tabIndex === 0 || !contactValue ? null : contactValue,
    };
    try {
      const response = await fetcher(
        `${process.env.REACT_APP_HOST_URL}/auth/${
          tabIndex === 0 ? "login" : "signup"
        }`,
        {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          `Failed to ${tabIndex === 0 ? "login" : "signup"}: ${
            data.errorMessage
          }`
        );
      }
      dispatchAuth({
        type: "LOGIN",
        payload: data,
      });
      setSnackbar({
        message: `${tabIndex === 0 ? "Logged in" : "Signed up"} successfully!`,
        severity: "success",
        open: true,
      });
      onClose();
    } catch (error) {
      setSnackbar({
        message: (error as Error).message,
        severity: "error",
        open: true,
      });
    }
  };

  const handleContactChange = (event: ChangeEvent<HTMLInputElement>) => {
    setContactValue(event.target.value);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="xs" fullWidth={true}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs centered onChange={handleChangeTab} value={tabIndex}>
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={1}>
            <TextField
              margin="normal"
              id="username"
              label="Username"
              type="text"
              variant="standard"
              value={usernameValue}
              onChange={onUsernameChange}
              error={!isUsernameValid && usernameError !== ""}
              helperText={!isUsernameValid ? usernameError : null}
            />
            <TextField
              margin="normal"
              id="password"
              label="Password"
              type="text"
              variant="standard"
              value={pwValue}
              onChange={onPwChange}
              error={!isPwValid && pwError !== ""}
              helperText={!isPwValid ? pwError : null}
            />
            {tabIndex === 1 && (
              <TextField
                margin="normal"
                id="contact"
                label="Contact (Optional)"
                type="text"
                variant="standard"
                value={contactValue}
                onChange={handleContactChange}
                helperText="For me to contact you if needed. E.g. email, ig username"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isUsernameValid || !isPwValid}
          >
            {tabIndex === 0 ? "Login" : "Signup"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Login;
