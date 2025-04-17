import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    credentials: "include",
  }),
  tagTypes: ["Profile", "Resume", "SavedJobs", "Applications"], // Added for cache invalidation
  endpoints: (builder) => ({
    getAnalytics: builder.query({
      query: () => "/user/analytics",
    }),

    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),

    createProfile: builder.mutation({
      query: (profileData) => ({
        url: "/user/profile",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/user/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
    }),

    deleteProfile: builder.mutation({
      query: () => ({
        url: "/user/profile",
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),

    uploadResume: builder.mutation({
      query: (fileData) => ({
        url: "/user/resumes",
        method: "POST",
        body: fileData,
      }),
      invalidatesTags: ["Resume"],
    }),

    deleteResume: builder.mutation({
      query: (id) => ({
        url: `/user/resumes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Resume"],
    }),

    getResume: builder.query({
      query: () => "/user/resumes",
      providesTags: ["Resume"],
    }),

    previewResume: builder.query({
      query: (filename) => ({
        url: `/user/resumes/${filename}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => URL.createObjectURL(response),
    }),

    getSavedJobs: builder.query({
      query: () => "/user/saved-jobs",
      providesTags: ["SavedJobs"],
    }),

    saveJob: builder.mutation({
      query: (job_post_id) => ({
        url: "/user/saved-jobs",
        method: "POST",
        body: { job_post_id }, // Added jobId in the body
      }),
      invalidatesTags: ["SavedJobs"],
    }),

    deleteSavedJob: builder.mutation({
      query: (id) => ({
        url: `/user/saved-jobs/${id}`,
        method: "DELETE",
      }),
    }),

    getApplications: builder.query({
      query: () => "/user/applications",
      providesTags: ["Applications"],
    }),

    jobApplication: builder.mutation({
      query: ({ jobId, resumeId }) => ({
        url: "/user/applications", // Fixed typo
        method: "POST",
        body: { jobId, resumeId }, // Added jobId and resumeId in the body
      }),
      invalidatesTags: ["Applications"],
    }),

    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `/user/applications/${id}`,
        method: "DELETE",
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
} = userApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const userApi = createApi({
//   reducerPath: "user",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:8080/api",
//     credentials: "include",
//   }), // Adjust base URL as needed
//   endpoints: (builder) => ({
//     getProfile: builder.query({
//       query: () => "/user/profile",
//     }),

//     createProfile: builder.mutation({
//       query: (profileData) => ({
//         url: "/user/profile",
//         method: "POST",
//         body: profileData,
//       }),
//     }),

//     updateProfile: builder.mutation({
//       query: (profileData) => ({
//         url: "/user/profile",
//         method: "PUT",
//         body: profileData,
//       }),
//     }),

//     deleteProfile: builder.mutation({
//       query: () => ({
//         url: "/user/profile",
//         method: "DELETE",
//       }),
//     }),

//     uploadResume: builder.mutation({
//       query: (fileData) => ({
//         url: "/user/resumes",
//         method: "POST",
//         body: fileData,
//       }),
//     }),

//     deleteResume: builder.mutation({
//       query: (id) => ({
//         url: `/user/resumes/${id}`,
//         method: "DELETE",
//       }),
//       // invalidatesTags: ["Resume"], // if you're using tags
//     }),

//     getResume: builder.query({
//       query: () => "/user/resumes",
//     }),

//     previewResume: builder.query({
//       query: (filename) => ({
//         url: `/user/resumes/${filename}`, // your backend endpoint
//         method: "GET",
//         responseHandler: (response) => response.blob(), // <- this is critical!
//       }),
//       transformResponse: (response) => {
//         // Convert the blob to an object URL for react-pdf
//         return URL.createObjectURL(response);
//       },
//     }),

//     getSavedJobs: builder.query({
//       query: () => "/user/saved-jobs",
//     }),

//     saveJob: builder.mutation({
//       query: () => ({
//         url: "/user/saved-jobs",
//         method: "POST",
//       }),
//     }),

//     getApplications: builder.query({
//       query: () => "/user/applications",
//     }),

//     jobApplication: builder.mutation({
//       query: () => ({
//         url: "/usr/applications",
//         method: "POST",
//       }),
//     }),
//   }),
// });

// export const {
//   useGetProfileQuery,
//   useCreateProfileMutation,
//   useUpdateProfileMutation,
//   useDeleteProfileMutation,
//   useUploadResumeMutation,
//   useGetResumeQuery,
//   usePreviewResumeQuery,
//   useDeleteResumeMutation,
//   useGetSavedJobsQuery,
//   useSaveJobMutation,
//   useGetApplicationsQuery,
//   useJobApplicationMutation,
// } = userApi;
