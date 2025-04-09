import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    credentials: "include",
  }), // Adjust base URL as per your backend
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    authMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    registerCompany: builder.mutation({
      query: (data) => ({
        url: "/auth/register_company",
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      // transformResponse: (response) => {
      //   // console.log(response, "at login info");
      //   localStorage.setItem("user", JSON.stringify(response.user));
      //   const { user, ...data } = response;
      //   console.log(user, data);
      // },
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    // Add more endpoints as needed (e.g., updateProfile, getProfile, deleteProfile)
    // login: builder.mutation({
    //   query: (data) => ({
    //     url: "/auth/login",
    //     method: "POST",
    //     body: data,
    //   }),
    //   transformResponse: (response) => {
    //     // Example: Rename a field in the response
    //     return { ...response, userId: response.id };
    //   },
    // }),
  }),
});

export const {
  useAuthMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useRegisterCompanyMutation,
  useLogoutMutation,
} = authApi;
