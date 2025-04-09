import { createBrowserRouter, Link, Outlet } from "react-router-dom"; // Import Outlet
import Navigation from "../components/Navigation";
import SignIn from "../pages/auth/SignIn.jsx";
import SignUp from "../pages/auth/SignUp.jsx";
import Register from "../pages/auth/Register.jsx";
import Home from "../pages/Home.jsx";
import Job from "../pages/job/Job.jsx";

const NotFound = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

// Layout component to include Navigation
const AppLayout = () => (
  <>
    <Navigation />
    <div className="pt-16">
      {/* For Sticky no need pt-16 if you fixed need pt-16 */}
      {/* <div className="container mx-auto"> */}
      {/* Adjust 'pt-16' to your navbar's height */}
      <Outlet />
    </div>
    {/* <Outlet /> */}
    {/* Render child routes here */}
  </>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />, // Wrap all routes with the layout
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/job",
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
      { path: "/register_company", element: <Register /> },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
