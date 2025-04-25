import { createBrowserRouter, Outlet } from "react-router-dom"; // Keep Outlet
import { Navigate } from "react-router-dom";
import { useAuthMeQuery } from "../redux/api/authApi.js";

import Navigation from "../components/navbar/Navigation.jsx";
import SignIn from "../pages/auth/SignIn.jsx";
import SignUp from "../pages/auth/SignUp.jsx";
import Register from "../pages/auth/Register.jsx";
import Home from "../pages/Home.jsx";
import Job from "../pages/job/Job.jsx";
import Employer from "../pages/dashboard/employer/Employer.jsx";
import JobDashboard from "../pages/dashboard/employer/JobDashboard.jsx";
import EmployerProfile from "../pages/profile/EmployerProfile.jsx";
import UserProfile from "../pages/profile/UserProfile.jsx";
import UserDashboard from "../pages/dashboard/user/UserDashboard.jsx";
import Resume from "../pages/profile/Resume.jsx";

const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-2">404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { data, isLoading, isError } = useAuthMeQuery(null);

  if (isLoading) return <div>Loading...</div>;

  if (isError || !data?.user) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(data.user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { data, isLoading, isError } = useAuthMeQuery();
//   // console.log(user, "at protective", allowedRoles);
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError || !data.user) {
//     // Redirect unauthenticated users to login
//     return <Navigate to="/login" replace />;
//   }

//   if (!allowedRoles.includes(data.user.role)) {
//     // Redirect unauthorized users to home
//     console.log(
//       `User with role '${
//         data.user.role
//       }' tried to access a route restricted to roles: ${allowedRoles.join(
//         ", "
//       )}`
//     );
//     return <Navigate to="/" replace />;
//   }

//   // console.log(!allowedRoles.includes(user.role), "at protective");

//   return children;
// };

// export default ProtectedRoute;

// Keep AppLayout as it is
const AppLayout = () => (
  <>
    <Navigation />
    <main className="pt-16">
      {/* Adjust padding as needed */}
      <Outlet /> {/* Renders the matched child route component */}
    </main>
  </>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />, // AppLayout provides Navbar and Outlet
    children: [
      // --- Public Routes ---
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/job", // Assuming Job listing is public, adjust if needed
        element: <Job />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/register_company", // Assuming public, adjust if needed
        element: <Register />,
      },

      // --- Employer Routes (Protected) ---
      {
        path: "/dashboard/employer",
        element: (
          <ProtectedRoute allowedRoles={["employer"]}>
            <Employer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/employer",
        element: (
          <ProtectedRoute allowedRoles={["employer"]}>
            <EmployerProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/employer/post-job",
        element: (
          <ProtectedRoute allowedRoles={["employer"]}>
            <JobDashboard />
          </ProtectedRoute>
        ),
      },

      // --- Job Seeker Routes (Example - Add if needed) ---
      {
        path: "/user/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard /> {/* Create this component */}
          </ProtectedRoute>
        ),
      },
      {
        path: "/user/profile",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <UserProfile /> {/* Create this component */}
          </ProtectedRoute>
        ),
      },
      {
        path: "/user/resume",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <Resume /> {/* Create this component */}
          </ProtectedRoute>
        ),
      },

      // --- Admin Routes (Example - Add if needed) ---
      // {
      //   path: "/admin/dashboard",
      //   element: (
      //     <ProtectedRoute allowedRoles={['admin']}>
      //       <AdminDashboard /> Create this component
      //     </ProtectedRoute>
      //   ),
      // },

      // --- Catch-all Not Found Route ---
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  // You could potentially have routes outside the AppLayout if needed
  // For example, a dedicated fullscreen login page without the main navbar
  // {
  //   path: "/alternative-login",
  //   element: <AlternativeLoginPage />
  // }
]);
