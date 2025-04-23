import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobApi = createApi({
  reducerPath: "job",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:8080/api",
    baseUrl: import.meta.env.VITE_APP_API_URL || "http://localhost:8000",
    credentials: "include",
  }), // Adjust base URL as needed

  // providesTags: (result, error, id) => [{ type: "Job", id }], // Tag to invalidate cache when data changes

  tagTypes: ["Job"], // Define tag for cache management

  // keepUnusedDataFor: 20,

  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => ({
        url: "/api/job-posts",
        method: "GET",
        // keepUnusedDataFor: 20,
      }),
      providesTags: ["Job"], // Tag to invalidate cache when data changes
    }),

    getJobById: builder.query({
      query: (id) => ({
        url: `/api/job-posts/${id}`,
        method: "GET",
        // keepUnusedDataFor: 20,
      }),
      keepUnusedDataFor: 10,
    }),

    createNewJob: builder.mutation({
      query: (formData) => ({
        url: "/api/employer/jobs",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useGetJobsQuery, useGetJobByIdQuery, useCreateNewJobMutation } =
  jobApi;
