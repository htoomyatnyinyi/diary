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

    uploadResume: builder.mutation({
      query: (fileData) => ({
        url: "/user/resumes",
        method: "POST",
        body: fileData,
      }),
    }),

    deleteResume: builder.mutation({
      query: (id) => ({
        url: `/user/resumes/${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: ["Resume"], // if you're using tags
    }),

    getResume: builder.query({
      query: () => "/user/resumes",
    }),

    previewResume: builder.query({
      query: (filename) => ({
        url: `/user/resumes/${filename}`, // your backend endpoint
        method: "GET",
        responseHandler: (response) => response.blob(), // <- this is critical!
      }),
      transformResponse: (response) => {
        // Convert the blob to an object URL for react-pdf
        return URL.createObjectURL(response);
      },
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
  useUploadResumeMutation,
  useGetResumeQuery,
  usePreviewResumeQuery,
  useDeleteResumeMutation,
  useGetSavedJobsQuery,
  useGetApplicationsQuery,
} = userApi;
