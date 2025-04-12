import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employerApi = createApi({
  reducerPath: "employerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    credentials: "include",
  }), // Adjust base URL as needed
  // keepUnusedDataFor: 20,

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
  }),
  tagTypes: ["EmployerProfile"], // Define tag for cache management
});

export const {
  useGetEmployerProfileQuery,
  useRegisterEmployerMutation,
  useCreateEmployerProfileMutation,
  useUpdateEmployerProfileMutation,
} = employerApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const employerApi = createApi({
//   reducerPath: "employer",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:8080/api",
//     credentials: "include",
//   }),
//   tagTypes: ["EmployerProfile"],
//   endpoints: (builder) => ({
//     registerEmployer: builder.mutation({
//       query: (employerData) => ({
//         url: "/auth/register_employer",
//         method: "POST",
//         body: employerData,
//       }),
//     }),

//     createEmployerProfile: builder.mutation({
//       query: (profileData) => ({
//         url: "/employer/profile",
//         method: "POST",
//         body: profileData,
//       }),
//     }),

//     getEmployerProfile: builder.query({
//       query: () => ({
//         url: "/employer/profile",
//         method: "GET",
//       }),
//       providesTags: ["EmployerProfile"], // Added to enable cache invalidation
//       transformResponse: (response) => {
//         console.log("Fetched profile:", response);
//         return response;
//       },
//     }),
//     updateEmployerProfile: builder.mutation({
//       query: (profileData) => ({
//         url: "/employer/profile",
//         method: "PUT",
//         body: profileData,
//       }),
//       invalidatesTags: ["EmployerProfile"],
//       transformResponse: (response) => {
//         console.log("Update response:", response);
//         return response;
//       },
//     }),
//   }),
// });

// export const {
//   useGetEmployerProfileQuery,
//   useRegisterEmployerMutation,
//   useCreateEmployerProfileMutation,
//   useUpdateEmployerProfileMutation,
// } = employerApi;
