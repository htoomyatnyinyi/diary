import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

import { registerApi } from "./api/registerApi";

const store = configureStore({
  reducer: {
    reducer: rootReducer,
    [registerApi.reducerPath]: registerApi.reducer, // Add RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(registerApi.middleware), // Add RTK Query middleware
});
export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage
// import rootReducer from "./rootReducer";

// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["auth"], // Only persist auth slice
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//       },
//     }),
// });

// export const persistor = persistStore(store);
