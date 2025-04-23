import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AiFillAccountBook,
  AiFillAlipayCircle,
  // AiFillAmazonSquare,
  // AiFillBulb,
} from "react-icons/ai";

//
import logo from "../../assets/utils/1.png";

const navLinks = [
  // { name: "HOME", icon: <AiFillAccountBook />, path: "/" },
  { name: "JOB", icon: <AiFillAlipayCircle />, path: "/job" },
  // { name: "JOB_BOARD", icon: <AiFillAlipayCircle />, path: "/job-board" },
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
    <div className="flex space-x-8">
      <div className="flex-shrink-0 border-t-2 border-l-2 hover:border-white border-cyan-900 dark:border-white dark:hover:border-cyan-900  ">
        <Link to="/" className="flex items-baseline dark:hover:text-sky-100">
          <p className="text-[5px] rotate-270  hover:text-white">HMNN</p>
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-auto  dark:invert-100 m-1" // bg-white remove the dark:invet-100
          />
          <p>JobDiary</p>
        </Link>
      </div>
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
    </div>
  );
};

export default Links; 

// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   AiFillAccountBook,
//   AiFillAlipayCircle,
//   // AiFillAmazonSquare,
//   // AiFillBulb,
// } from "react-icons/ai";

// const navLinks = [
//   { name: "HOME", icon: <AiFillAccountBook />, path: "/" },
//   { name: "JOB", icon: <AiFillAlipayCircle />, path: "/job" },
//   { name: "JOB_BOARD", icon: <AiFillAlipayCircle />, path: "/job-board" },
//   // { name: "Dashboard", icon: <AiFillAmazonSquare />, path: "/dashboard" },
//   // { name: "Register Company", icon: <AiFillBulb />, path: "/register_company" },
// ];

// const NavLink = ({ name, icon, path, isActive }) => (
//   <Link
//     to={path}
//     className={`flex items-center p-2  border-b-2 hover:border-cyan-900 dark:hover:bg-white dark:hover:text-cyan-900 hover:bg-cyan-900 hover:text-white  transition-colors duration-200 ${
//       isActive ? "border-l-2 dark:border-cyan-900 " : ""
//     }`}
//   >
//     {icon && <span className="pr-4">{icon}</span>}
//     <span>{name}</span>
//   </Link>
// );

// const Links = () => {
//   const location = useLocation();

//   return (
//     <nav className="flex flex-col md:flex-row md:items-center md:space-x-4">
//       <div className="flex flex-col md:flex-row md:space-x-2  md:space-y-0">
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
//     </nav>
//   );
// };

// export default Links;
