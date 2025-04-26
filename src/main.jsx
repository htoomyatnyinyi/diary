import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Provider } from "react-redux";
import store from "./redux/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
        <ToastContainer />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
