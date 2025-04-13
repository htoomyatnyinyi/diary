import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

import { authApi } from "./api/authApi";
import { employerApi } from "./api/employerApi";
import { jobApi } from "./api/jobApi";
import { userApi } from "./api/userApi";

const store = configureStore({
  reducer: {
    slice: rootReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [employerApi.reducerPath]: employerApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(jobApi.middleware)
      .concat(employerApi.middleware)
      .concat(userApi.middleware),
});

export default store;
