import { AUTH_URL } from "@constants/apiUrl";
import { apiSlice } from "@redux/apiSlice";

export const autApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: AUTH_URL + "/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: AUTH_URL + "/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation } = autApi; // Export hooks if needed
