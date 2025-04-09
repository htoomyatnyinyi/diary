import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Provider } from "react-redux";
import store from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";

// import { Provider } from "react-redux";
// import store from "./redux/store.js";
// // import { PersistGate } from "redux-persist/integration/react";
// // import { store, persistor } from "./redux/store.js";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Provider store={store}>
//       {/* <PersistGate loading={null} persistor={persistor}>
//       </PersistGate> */}
//       <App />
//     </Provider>
//   </StrictMode>
// );
