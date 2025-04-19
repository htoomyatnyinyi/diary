import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employerApi = createApi({
  reducerPath: "employerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    credentials: "include",
  }), // Adjust base URL as needed
  // keepUnusedDataFor: 20,

  // 1. Define tag types used by this API slice
  tagTypes: ["AppliedJobs", "Application"], // Added 'Application' if you want granular control, 'AppliedJobs' for the list

  endpoints: (builder) => ({
    registerEmployer: builder.mutation({
      query: (employerData) => ({
        url: "/auth/register_employer",
        method: "POST",
        body: employerData,
      }),

      // Optional: Add invalidatesTags if you want to invalidate cached data
      // invalidatesTags: ['Employer'],
    }),

    createEmployerProfile: builder.mutation({
      query: (profileData) => ({
        url: "/employer/profile",
        method: "POST",
        body: profileData,
      }),
      // invalidatesTags: ['EmployerProfile'],
    }),

    getEmployerProfile: builder.query({
      query: () => ({
        url: "/employer/profile",
        // keepUnusedDataFor: 20,
        method: "GET",
      }),
      validatesTags: ["EmployerProfile"], // Tag to manage cache
      // invalidatesTags: ["EmployerProfile"], // Invalidate cache when data changes
    }),

    // same
    // updateEmployerProfile: builder.mutation({
    //   query: (profileData) => ({
    //     url: "/employer/profile",
    //     method: "PUT", // Use PUT or PATCH depending on your backend
    //     body: profileData,
    //   }),
    //   invalidatesTags: ["EmployerProfile"], // Invalidate cache after update
    // }),
    // same

    updateEmployerProfile: builder.mutation({
      query: (profileData) => ({
        url: "/employer/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["EmployerProfile"],
      transformResponse: (response) => {
        console.log("Update response:", response);
        return response;
      },
    }),

    getAppliedJobs: builder.query({
      query: () => ({
        url: "/employer/applied-jobs",
      }),
      // 2. Specify that this query provides 'AppliedJobs' data
      //    - Provide a general tag for the whole list.
      //    - Optionally, provide specific tags for each job and application if needed elsewhere.
      providesTags: (result, error, arg) =>
        result?.data // Check if result and result.data exist
          ? [
              // Tag for the overall list
              { type: "AppliedJobs", id: "LIST" },
              // Optionally, tags for individual jobs within the list
              ...result.data.map((job) => ({
                type: "AppliedJobs",
                id: job.id,
              })),
              // Optionally, tags for individual applications within each job (more granular)
              ...result.data.flatMap((job) =>
                job.applications
                  ? job.applications.map((app) => ({
                      type: "Application",
                      id: app.id,
                    }))
                  : []
              ),
            ]
          : // Fallback tag if data is empty or load failed but we still want to invalidate the list later
            [{ type: "AppliedJobs", id: "LIST" }],
    }),

    updateApplicationStatus: builder.mutation({
      query: ({ id, statusData }) => ({
        url: `/employer/applications/${id}/status`,
        method: "PUT",
        body: statusData,
      }),
      // 3. Specify that this mutation invalidates 'AppliedJobs' data
      //    When an application status changes, the list of applied jobs should be refreshed.
      //    'arg' here is the object passed to the mutation hook: { id, statusData }
      invalidatesTags: (result, error, arg) => [
        { type: "AppliedJobs", id: "LIST" }, // Invalidate the whole list - simplest approach
        // Optionally, invalidate the specific application tag if queries use it
        { type: "Application", id: arg.id },
      ],
    }),

    getAppliedUserProfileById: builder.query({
      query: (id) => ({
        url: `/employer/applied-user-profile/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetEmployerProfileQuery,
  useRegisterEmployerMutation,
  useCreateEmployerProfileMutation,
  useUpdateEmployerProfileMutation,
  useGetAppliedJobsQuery,
  useUpdateApplicationStatusMutation,
  useGetAppliedUserProfileByIdQuery,
} = employerApi;
