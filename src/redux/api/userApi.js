import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    credentials: "include",
  }), // Adjust base URL as needed
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/user/profile",
    }),

    createProfile: builder.mutation({
      query: (profileData) => ({
        url: "/user/profile",
        method: "POST",
        body: profileData,
      }),
    }),

    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/user/profile",
        method: "PUT",
        body: profileData,
      }),
    }),

    deleteProfile: builder.mutation({
      query: () => ({
        url: "/user/profile",
        method: "DELETE",
      }),
    }),

    getResume: builder.query({
      query: () => "/user/resumes",
    }),

    getSavedJobs: builder.query({
      query: () => "/user/saved-jobs",
    }),

    getApplications: builder.query({
      query: () => "/user/applications",
    }),
  }),
});

export const {
  useGetProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useGetResumeQuery,
  useGetSavedJobsQuery,
  useGetApplicationsQuery,
} = userApi;
