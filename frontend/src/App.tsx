import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import "./App.css";
import HomePage from "./components/HomePage";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useState } from "react";
import { sidebarStore } from "./store/sidebarStore";
import Login from "./components/AppBar/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { snackbarStore } from "./store/snackbarStore";
import { authStore } from "./store/authStore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import About from "./components/AppBar/About";

function App() {
  const { state, dispatch } = useContext(sidebarStore);
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
  const [openAboutModal, setOpenAboutModal] = useState<boolean>(false);
  const { setSnackbar } = useContext(snackbarStore);
  const { state: authState, dispatch: dispatchAuth } = useContext(authStore);

  const handleMenuClick = () => {
    dispatch({
      type: state.open ? "CLOSE" : "OPEN",
    });
  };

  const handleOpenAboutModal = () => {
    setOpenAboutModal(true);
  };

  const handleAboutModalClose = () => {
    setOpenAboutModal(false);
  };

  const handleLoginSignup = () => {
    setOpenLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setOpenLoginModal(false);
  };

  const handleLogout = () => {
    dispatchAuth({
      type: "LOGOUT",
    });
    setSnackbar({
      message: `Logged out successfully!`,
      severity: "success",
      open: true,
    });
  };

  return (
    <div className="App">
      {openAboutModal && <About onClose={handleAboutModalClose} />}
      {openLoginModal && <Login onClose={handleLoginModalClose} />}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Meltiverse 無間宙
              <IconButton
                aria-label="help"
                onClick={handleOpenAboutModal}
                style={{ color: "white" }}
              >
                <HelpOutlineIcon />
              </IconButton>
            </Typography>
            {authState.loggedIn ? (
              <div>
                {authState.username}
                <IconButton
                  aria-label="logout"
                  onClick={handleLogout}
                  style={{ color: "white" }}
                >
                  <LogoutIcon />
                </IconButton>
              </div>
            ) : (
              <Button color="inherit" onClick={handleLoginSignup}>
                Login / Signup
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <HomePage />
    </div>
  );
}

export default App;
