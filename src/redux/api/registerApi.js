import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const registerApi = createApi({
  reducerPath: "register",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_URL || "http://localhost:8000",
    credentials: "include",
    // baseUrl: "http://localhost:8080/api",
  }), // Adjust base URL as per your backend
  endpoints: (builder) => ({
    registerCompany: builder.mutation({
      query: (userData) => ({
        url: "/api/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    loginCompany: builder.mutation({
      query: (loginData) => ({
        url: "/api/auth/login",
        method: "POST",
        body: loginData,
      }),
    }),
    createEmployerProfile: builder.mutation({
      query: (profileData) => ({
        url: "/api/employer/profile",
        method: "POST",
        body: profileData,
      }),
    }),
    getEmployerProfile: builder.query({
      query: () => ({
        url: "/api/employer/profile",
        method: "GET",
      }),
    }),
    // Add more endpoints as needed (e.g., updateProfile, getProfile, deleteProfile)
  }),
});

export const {
  useRegisterCompanyMutation,
  useLoginCompanyMutation,
  useCreateEmployerProfileMutation,
  useGetEmployerProfileQuery,
} = registerApi;
