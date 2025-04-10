import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    credentials: "include",
  }), // Adjust base URL as needed
  tagTypes: ["Job"], // Define tag for cache management
  // keepUnusedDataFor: 20,

  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => ({
        url: "/job-posts",
        method: "GET",
        // keepUnusedDataFor: 20,
      }),
    }),

    getJobById: builder.query({
      query: (id) => ({
        url: `/job-posts/${id}`,
        method: "GET",
        // keepUnusedDataFor: 20,
      }),
    }),
  }),
});

export const { useGetJobsQuery, useGetJobByIdQuery } = jobApi;
