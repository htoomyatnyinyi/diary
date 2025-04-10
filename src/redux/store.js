import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

import { authApi } from "./api/authApi";
import { employerApi } from "./api/employerApi";
import { jobApi } from "./api/jobApi";

const store = configureStore({
  reducer: {
    reducer: rootReducer,
    [authApi.reducerPath]: authApi.reducer,
    [employerApi.reducerPath]: employerApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(jobApi.middleware)
      .concat(employerApi.middleware),
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
