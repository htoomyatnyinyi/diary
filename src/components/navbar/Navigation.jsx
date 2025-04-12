import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import Links from "./Links";
import logo from "../../assets/utils/1.png";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

import { useAuthMeQuery, useLogoutMutation } from "../../redux/api/authApi";
import { AiFillCode } from "react-icons/ai";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const { data: userData, isLoading: isAuthLoading } = useAuthMeQuery(null);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const isAuthenticated = !!userData?.user;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      setIsProfileOpen(false); // Close dropdown
      setIsMobileMenuOpen(false); // Close mobile menu
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const profileLinks = [
    { name: "PROFILE", path: "/profile/employer" },
    { name: "DASHBOARD", path: "/dashboard/employer" },
    { name: "CREATE-POST", path: "/employer/post-job" },
    { name: "SETTINGS", path: "/settings" },
    { name: "HMNN" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50  backdrop-blur-4xl ">
      <div className=" mx-auto shadow-2xl backdrop-blur-3xl  px-4 sm:px-6 lg:px-8">
        {/* <div className="max-w-7xl mx-auto shadow-2xl backdrop-blur-3xl  px-4 sm:px-6 lg:px-8"> */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 border-t-2 border-l-2 hover:border-white border-cyan-900 dark:border-white dark:hover:border-cyan-900  ">
            <Link
              to="/"
              className="flex items-baseline dark:hover:text-sky-100"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto  dark:invert-100 m-1" // bg-white remove the dark:invet-100
              />
              <p>JobDiary</p>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Links />
          </div>

          {/* Right Section (Profile + Theme Toggle) */}
          <div className="hidden md:flex items-center space-x-4 ">
            {isAuthenticated ? (
              <div className="relative hover:text-white hover:bg-cyan-900 dark:hover:text-cyan-900 dark:hover:bg-white border-b-2 border-r-2">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center p-2  hover:text-cyan-300 transition-colors duration-200"
                  aria-label="Toggle profile menu"
                >
                  <FaUserCircle size={24} />
                  <span className="ml-2">
                    {userData?.user?.email.split("@")[0]}
                  </span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-cyan-900 text-white dark:bg-white dark:text-cyan-900 shadow-lg z-10">
                    {profileLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="block px-4 py-2 text-sm  hover:bg-white hover:text-cyan-900 dark:bg-cyan-900 dark:text-white"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 bg-white hover:bg-red-400 hover:text-white"
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="p-2  hover:text-white hover:bg-cyan-900 dark:hover:text-cyan-900 dark:hover:bg-white transition-colors duration-200 border-b-2 border-r-2"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle />

            <div>
              <Link to="/register_company" className="underline">
                <AiFillCode />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-sky-900 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md px-4 py-2">
            <Links />
            <div className="flex flex-col space-y-2 mt-2">
              {isAuthenticated ? (
                <>
                  {profileLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="p-2 text-gray-700 hover:bg-sky-100 hover:text-sky-900 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="p-2 text-red-600 hover:bg-red-100 hover:text-red-900 rounded-md text-left"
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  className="p-2 text-gray-700 hover:bg-sky-100 hover:text-sky-900 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <div className="py-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
