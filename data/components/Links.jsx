import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AiFillAccountBook,
  AiFillAlipayCircle,
  AiFillAmazonSquare,
  AiFillBulb,
  AiFillSignal,
} from "react-icons/ai";

const Links = () => {
  const location = useLocation();
  const links = [
    { name: "Home", icon: <AiFillAccountBook />, path: "/" },
    { name: "Job", icon: <AiFillAlipayCircle />, path: "/job" },
    { name: "Dashboard", icon: <AiFillAmazonSquare />, path: "/dashboard" },
    {
      name: "RegisterCompany",
      icon: <AiFillBulb />,
      path: "/register_company",
    },
  ];
  const session = false; // Mock session state
  const isAdmin = false; // Mock admin state

  return (
    <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
      {links.map((link) => (
        <NavLink
          key={link.path}
          // name={link.name}
          icon={link.icon}
          path={link.path}
          isActive={location.pathname === link.path}
        />
      ))}
      {session ? (
        <>
          {isAdmin && (
            <NavLink
              name="Dashboard"
              path="/dashboard"
              isActive={location.pathname === "/dashboard"}
            />
          )}
          <button className="w-full md:w-auto p-2 text-cyan-900 hover:text-black transition-colors duration-200">
            Logout
          </button>
        </>
      ) : (
        <NavLink
          name="Sign In"
          icon={<AiFillSignal />}
          path="/signin"
          isActive={location.pathname === "/signin"}
        />
      )}
    </div>
  );
};

const NavLink = ({ name, icon, path, isActive }) => (
  <Link
    to={path}
    className={`flex items-center p-2 text-cyan-900 hover:text-black transition-colors duration-200 ${
      isActive ? "border-b-4 border-cyan-900 font-semibold" : ""
    }`}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {name}
  </Link>
);

export default Links;
