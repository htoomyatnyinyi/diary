import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AiFillAccountBook,
  AiFillAlipayCircle,
  // AiFillAmazonSquare,
  // AiFillBulb,
} from "react-icons/ai";

const navLinks = [
  { name: "HOME", icon: <AiFillAccountBook />, path: "/" },
  { name: "JOB", icon: <AiFillAlipayCircle />, path: "/job" },
  { name: "JOB_BOARD", icon: <AiFillAlipayCircle />, path: "/job-board" },
  // { name: "Dashboard", icon: <AiFillAmazonSquare />, path: "/dashboard" },
  // { name: "Register Company", icon: <AiFillBulb />, path: "/register_company" },
];

const NavLink = ({ name, icon, path, isActive }) => (
  <Link
    to={path}
    className={`flex items-center p-2  border-b-2 hover:border-cyan-900 dark:hover:bg-white dark:hover:text-cyan-900 hover:bg-cyan-900 hover:text-white  transition-colors duration-200 ${
      isActive ? "border-l-2 dark:border-cyan-900 " : ""
    }`}
  >
    {icon && <span className="pr-4">{icon}</span>}
    <span>{name}</span>
  </Link>
);

const Links = () => {
  const location = useLocation();

  return (
    <nav className="flex flex-col md:flex-row md:items-center md:space-x-4">
      <div className="flex flex-col md:flex-row md:space-x-2  md:space-y-0">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            name={link.name}
            icon={link.icon}
            path={link.path}
            isActive={location.pathname === link.path}
          />
        ))}
      </div>
    </nav>
  );
};

export default Links;

// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   AiFillAccountBook,
//   AiFillAlipayCircle,
//   AiFillAmazonSquare,
//   AiFillBulb,
//   AiFillSignal,
// } from "react-icons/ai";
// import { useAuthMeQuery, useLogoutMutation } from "../redux/api/authApi";

// // Navigation link data
// const navLinks = [
//   { name: "Home", icon: <AiFillAccountBook />, path: "/" },
//   { name: "Job", icon: <AiFillAlipayCircle />, path: "/job" },
//   { name: "Dashboard", icon: <AiFillAmazonSquare />, path: "/dashboard" },
//   { name: "Register Company", icon: <AiFillBulb />, path: "/register_company" },
// ];

// // NavLink component
// const NavLink = ({ name, icon, path, isActive }) => (
//   <Link
//     to={path}
//     className={`flex items-center p-2 rounded-md hover:bg-sky-100 hover:text-sky-900 transition-colors duration-200 ${
//       isActive ? "bg-sky-200 text-sky-900 font-semibold" : "text-gray-700"
//     }`}
//   >
//     {icon && <span className="mr-2 text-xl">{icon}</span>}
//     <span>{name}</span>
//   </Link>
// );

// const Links = () => {
//   const location = useLocation();
//   const { data: userData, isLoading } = useAuthMeQuery(null, {
//     skip: false, // Fetch user data by default; adjust based on your auth logic
//   });

//   const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

//   // Replace mock session/admin with real auth state (e.g., from userData)
//   const isAuthenticated = !!userData?.user; // True if user is logged in
//   const isAdmin = userData?.user?.role === "admin"; // Adjust based on your role logic

//   const handleLogout = async () => {
//     try {
//       await logout().unwrap();
//       // Optionally redirect or update state after logout
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };
//   return (
//     <nav className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 p-4 bg-gray-100 rounded-lg shadow-md">
//       {/* Main navigation links */}
//       <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
//         {navLinks.map((link) => (
//           <NavLink
//             key={link.path}
//             name={link.name}
//             icon={link.icon}
//             path={link.path}
//             isActive={location.pathname === link.path}
//           />
//         ))}
//       </div>

//       {/* Auth-dependent links/buttons */}
//       <div className="flex items-center space-x-4">
//         {isAuthenticated ? (
//           <>
//             {isAdmin && (
//               <NavLink
//                 name="Admin Dashboard"
//                 path="/dashboard"
//                 isActive={location.pathname === "/dashboard"}
//               />
//             )}
//             <button
//               type="button"
//               className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 disabled:bg-red-300"
//               onClick={handleLogout}
//               disabled={isLoggingOut}
//             >
//               {isLoggingOut ? "Logging out..." : "Logout"}
//             </button>
//             {/* <button
//               type="button"
//               className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
//               onClick={() => {
//                 logout();
//                 // Add logout logic here (e.g., call logout mutation)
//                 // console.log("Logout clicked");
//               }}
//             >
//               Logout
//             </button> */}
//           </>
//         ) : (
//           <NavLink
//             name="Sign In"
//             icon={<AiFillSignal />}
//             path="/signin"
//             isActive={location.pathname === "/signin"}
//           />
//         )}
//       </div>

//       {/* User Info */}
//       {isAuthenticated && (
//         <div className="flex items-center bg-slate-600 text-white p-3 rounded-md mt-2 md:mt-0">
//           <div className="bg-sky-400 rounded-full h-10 w-10 flex items-center justify-center mr-3">
//             <span className="text-white font-semibold">
//               {userData?.user?.email?.charAt(0).toUpperCase() || "U"}
//             </span>
//           </div>
//           <div>
//             <h5 className="text-sm font-medium">{userData?.user?.email}</h5>
//             <p className="text-xs capitalize">{userData?.user?.role}</p>
//           </div>
//         </div>
//       )}

//       {/* Loading state for user data */}
//       {isLoading && (
//         <div className="flex items-center space-x-2 text-gray-500">
//           <div className="animate-pulse bg-gray-300 rounded-full h-10 w-10"></div>
//           <div className="space-y-1">
//             <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
//             <div className="animate-pulse bg-gray-300 h-3 w-16 rounded"></div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Links;

// // import React from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import {
// //   AiFillAccountBook,
// //   AiFillAlipayCircle,
// //   AiFillAmazonSquare,
// //   AiFillBulb,
// //   AiFillSignal,
// // } from "react-icons/ai";
// // import { useAuthMeQuery } from "../redux/api/authApi";

// // const Links = () => {
// //   const location = useLocation();
// //   const { data } = useAuthMeQuery(null);
// //   console.log(data);

// //   const links = [
// //     { name: "Home", icon: <AiFillAccountBook />, path: "/" },
// //     { name: "Job", icon: <AiFillAlipayCircle />, path: "/job" },
// //     { name: "Dashboard", icon: <AiFillAmazonSquare />, path: "/dashboard" },
// //     {
// //       name: "RegisterCompany",
// //       icon: <AiFillBulb />,
// //       path: "/register_company",
// //     },
// //   ];

// //   const session = false; // Mock session state
// //   const isAdmin = false; // Mock admin state

// //   return (
// //     <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
// //       {links.map((link) => (
// //         <NavLink
// //           key={link.path}
// //           name={link.name}
// //           icon={link.icon}
// //           path={link.path}
// //           isActive={location.pathname === link.path}
// //         />
// //       ))}
// //       {session ? (
// //         <>
// //           {isAdmin && (
// //             <NavLink
// //               name="Dashboard"
// //               path="/dashboard"
// //               isActive={location.pathname === "/dashboard"}
// //             />
// //           )}
// //           <button className="w-full md:w-auto p-2  transition-colors duration-200">
// //             Logout
// //           </button>
// //         </>
// //       ) : (
// //         <NavLink
// //           name="Sign In"
// //           icon={<AiFillSignal />}
// //           path="/signin"
// //           isActive={location.pathname === "/signin"}
// //         />
// //       )}
// //       <div>
// //         <div className="flex space-x-5 items-center bg-slate-500 text-white p-2 m-1  rounded-md">
// //           <p className="bg-sky-400 rounded-full h-full w-full p-3"></p>
// //           <div>
// //             <h5>{data?.user.email}</h5>
// //             <p>{data?.user.role}</p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const NavLink = ({ name, icon, path, isActive }) => (
// //   <Link
// //     to={path}
// //     className={`flex items-center p-2 hover:text-sky-900 transition-colors duration-200 ${
// //       isActive ? "border-b-4 border-sky-900 font-semibold" : ""
// //     }`}
// //   >
// //     {icon && <span className="mr-2">{icon}</span>}
// //     {name}
// //   </Link>
// // );

// // export default Links;
