import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_URL || "http://localhost:8000",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    authMe: builder.query({
      query: () => ({
        url: "/api/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    googleLogin: builder.mutation({
      query: (body) => ({
        url: "/api/auth/google",
        method: "POST",
        body,
      }),
    }),

    // login: builder.mutation({
    //   query: (body) => ({
    //     url: "/api/auth/login",
    //     method: "POST",
    //     body,
    //   }),
    // }),

    login: builder.mutation({
      query: (data) => ({
        url: "/api/auth/login",
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
    registerCompany: builder.mutation({
      query: (data) => ({
        url: "/api/auth/register_company",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/api/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useAuthMeQuery,
  useGoogleLoginMutation,
  useLoginMutation,
  useRegisterCompanyMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const authApi = createApi({
//   reducerPath: "auth",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:8080/api",
//     credentials: "include",
//   }), // Adjust base URL as per your backend

//   tagTypes: ["Auth"],

//   endpoints: (builder) => ({
//     authMe: builder.query({
//       query: () => ({
//         url: "/auth/me",
//         method: "GET",
//       }),
//       providesTags: ["Auth"],
//     }),

//     googleLogin: builder.mutation({
//       query: (body) => ({
//         url: "/api/auth",
//         method: "POST",
//         body,
//       }),
//     }),

//     registerCompany: builder.mutation({
//       query: (data) => ({
//         url: "/auth/register_company",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["Auth"],
//     }),

//     register: builder.mutation({
//       query: (data) => ({
//         url: "/auth/register",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["Auth"],
//     }),

//     login: builder.mutation({
//       query: (data) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: data,
//       }),
//       // transformResponse: (response) => {
//       //   // console.log(response, "at login info");
//       //   localStorage.setItem("user", JSON.stringify(response.user));
//       //   const { user, ...data } = response;
//       //   console.log(user, data);
//       // },
//       invalidatesTags: ["Auth"],
//     }),

//     logout: builder.mutation({
//       query: () => ({
//         url: "/auth/logout",
//         method: "POST",
//       }),
//     }),
//   }),
// });

// export const {
//   useAuthMeQuery,
//   useLoginMutation,
//   useRegisterMutation,
//   useRegisterCompanyMutation,
//   useLogoutMutation,
//   useGoogleLoginMutation,
// } = authApi;

// // backup before change base url
// // import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // export const authApi = createApi({
// //   reducerPath: "auth",
// //   baseQuery: fetchBaseQuery({
// //     baseUrl: "http://localhost:8080/api",
// //     credentials: "include",
// //   }), // Adjust base URL as per your backend

// //   tagTypes: ["Auth"],

// //   endpoints: (builder) => ({
// //     authMe: builder.query({
// //       query: () => ({
// //         url: "/auth/me",
// //         method: "GET",
// //       }),
// //       providesTags: ["Auth"],
// //     }),
// //     googleLogin: builder.mutation({
// //       query: (body) => ({
// //         url: "/api/auth",
// //         method: "POST",
// //         body,
// //       }),
// //     }),
// //     // login: builder.mutation({
// //     //   query: (body) => ({
// //     //     url: "/api/auth/login",
// //     //     method: "POST",
// //     //     body,
// //     //   }),
// //     // }),

// //     registerCompany: builder.mutation({
// //       query: (data) => ({
// //         url: "/auth/register_company",
// //         method: "POST",
// //         body: data,
// //       }),
// //       invalidatesTags: ["Auth"],
// //     }),

// //     register: builder.mutation({
// //       query: (data) => ({
// //         url: "/auth/register",
// //         method: "POST",
// //         body: data,
// //       }),
// //       invalidatesTags: ["Auth"],
// //     }),

// //     login: builder.mutation({
// //       query: (data) => ({
// //         url: "/auth/login",
// //         method: "POST",
// //         body: data,
// //       }),
// //       // transformResponse: (response) => {
// //       //   // console.log(response, "at login info");
// //       //   localStorage.setItem("user", JSON.stringify(response.user));
// //       //   const { user, ...data } = response;
// //       //   console.log(user, data);
// //       // },
// //       invalidatesTags: ["Auth"],
// //     }),

// //     logout: builder.mutation({
// //       query: () => ({
// //         url: "/auth/logout",
// //         method: "POST",
// //       }),
// //     }),

// //     // googleLogin: builder.mutation({
// //     //   query: (authData) => ({
// //     //     url: "/auth/google",
// //     //     method: "POST",
// //     //     body: authData,
// //     //   }),
// //     // }),
// //     // Add more endpoints as needed (e.g., updateProfile, getProfile, deleteProfile)
// //     // login: builder.mutation({
// //     //   query: (data) => ({
// //     //     url: "/auth/login",
// //     //     method: "POST",
// //     //     body: data,
// //     //   }),
// //     //   transformResponse: (response) => {
// //     //     // Example: Rename a field in the response
// //     //     return { ...response, userId: response.id };
// //     //   },
// //     // }),
// //   }),
// // });

// // export const {
// //   useAuthMeQuery,
// //   useLoginMutation,
// //   useRegisterMutation,
// //   useRegisterCompanyMutation,
// //   useLogoutMutation,
// //   useGoogleLoginMutation,
// // } = authApi;
