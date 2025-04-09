import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
// import { configureStore } from "@reduxjs/toolkit";
// // import rootReducer from "./rootReducer";
// import { authApi } from "./api/authApi";
// // import { registerApi } from "./api/registerApi";

// const store = configureStore({
//   reducer: {
//     // reducer: rootReducer,
//     [authApi.reducerPath]: authApi.reducer,
//     // [registerApi.reducerPath]: registerApi.reducer, // Add RTK Query reducer
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(authApi.middleware),
// });
// export default store;
