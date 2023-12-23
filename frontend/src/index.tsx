import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ContentStateProvider } from "./store/contentStore";
import { SnackbarProvider } from "./store/snackbarStore";
import { SidebarStateProvider } from "./store/sidebarStore";
import { MediaStateProvider } from "./store/mediaStore";
import { BrowserRouter } from "react-router-dom";
import { AuthStateProvider } from "./store/authStore";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthStateProvider>
      <SidebarStateProvider>
        <ContentStateProvider>
          <SnackbarProvider>
            <MediaStateProvider>
              <App />
            </MediaStateProvider>
          </SnackbarProvider>
        </ContentStateProvider>
      </SidebarStateProvider>
    </AuthStateProvider>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
