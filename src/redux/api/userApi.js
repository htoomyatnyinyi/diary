import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_URL || "http://localhost:8080",
    credentials: "include",
  }),
  tagTypes: ["Profile", "Resume", "SavedJobs", "Applications"], // Added for cache invalidation
  endpoints: (builder) => ({
    getAnalytics: builder.query({
      query: () => "/api/user/analytics",
    }),

    getProfile: builder.query({
      query: () => "/api/user/profile",
      providesTags: ["Profile"],
    }),

    createProfile: builder.mutation({
      query: (profileData) => ({
        url: "/api/user/profile",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/api/user/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
    }),

    deleteProfile: builder.mutation({
      query: () => ({
        url: "/api/user/profile",
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),

    uploadResume: builder.mutation({
      query: (fileData) => ({
        url: "/api/user/resumes",
        method: "POST",
        body: fileData,
      }),
      invalidatesTags: ["Resume"],
    }),

    deleteResume: builder.mutation({
      query: (id) => ({
        url: `/api/user/resumes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Resume"],
    }),

    getResume: builder.query({
      query: () => "/api/user/resumes",
      providesTags: ["Resume"],
    }),

    previewResume: builder.query({
      query: (filename) => ({
        url: `/api/user/resumes/${filename}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => URL.createObjectURL(response),
    }),

    getSavedJobs: builder.query({
      query: () => "/api/user/saved-jobs",
      providesTags: ["SavedJobs"],
    }),

    saveJob: builder.mutation({
      query: (job_post_id) => ({
        url: "/api/user/saved-jobs",
        method: "POST",
        body: { job_post_id }, // Added jobId in the body
      }),
      invalidatesTags: ["SavedJobs"],
    }),

    deleteSavedJob: builder.mutation({
      query: (id) => ({
        url: `/api/user/saved-jobs/${id}`,
        method: "DELETE",
      }),
    }),

    getApplications: builder.query({
      query: () => "/api/user/applications",
      providesTags: ["Applications"],
    }),

    jobApplication: builder.mutation({
      query: ({ jobId, resumeId }) => ({
        url: "/api/user/applications", // Fixed typo
        method: "POST",
        body: { jobId, resumeId }, // Added jobId and resumeId in the body
      }),
      invalidatesTags: ["Applications"],
    }),

    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `/api/user/applications/${id}`,
        method: "DELETE",
      }),
    }),

    // uploadProfileImage: builder.mutation({
    //   query: (imageData) => ({
    //     url: `/api/upload/img`,
    //     method: "POST",
    //     body: imageData,
    //   }),
    // }),
    uploadUserProfileImage: builder.mutation({
      query: (imageData) => ({
        // url: "/api/user/profile_img",
        url: "/api/user/profile",
        method: "PUT",
        body: imageData,
      }),
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useUploadResumeMutation,
  useGetResumeQuery,
  usePreviewResumeQuery,
  useDeleteResumeMutation,
  useGetSavedJobsQuery,
  useSaveJobMutation,
  useDeleteSavedJobMutation,
  useGetApplicationsQuery,
  useJobApplicationMutation,
  useDeleteApplicationMutation,
  useUploadUserProfileImageMutation,
} = userApi;
