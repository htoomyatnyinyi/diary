import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";
import useMobileMenu from "../../hooks/useMobileMenu";
import MenuProfile from "./MenuProfile";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

import logo from "../../assets/utils/1.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { AiFillGift, AiFillProject } from "react-icons/ai";

import { useAuthMeQuery, useLogoutMutation } from "../../redux/api/authApi";

const Navigation = () => {
  const navigate = useNavigate();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useMobileMenu();

  const {
    data: userData,
    isLoading: isAuthLoading,
    isSuccess: isAuthSuccess,
  } = useAuthMeQuery(null);

  const [logout, { isLoading: isLoggingOut, isSuccess: logoutSuccess }] =
    useLogoutMutation();

  // const isAuthenticated = !!userData?.user;
  // const isAuthenticated = userData?.success; // replace with authSuccess

  const role = userData?.user?.role;

  // Manage dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null); // null, "profile", "signin", "signup"
  const profileRef = useRef(null);
  const signInRef = useRef(null);
  const signUpRef = useRef(null);

  const openDropdown = (dropdown) => setActiveDropdown(dropdown);
  const closeDropdown = () => setActiveDropdown(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        signInRef.current &&
        !signInRef.current.contains(event.target) &&
        signUpRef.current &&
        !signUpRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const profileLinks = [
    {
      name: "PROFILE",
      path: role === "employer" ? "/profile/employer" : "/user/profile",
    },
    ...(role === "user" ? [{ name: "RESUME", path: "/user/resume" }] : []),
    {
      name: "DASHBOARD",
      path: role === "employer" ? "/dashboard/employer" : "/user/dashboard",
    },
    ...(role === "employer"
      ? [{ name: "MANAGEMENT", path: "/employer/post-job" }]
      : []),
    { name: "SETTINGS", path: "/settings" },
  ];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      closeDropdown();
      closeMobileMenu();
      // if (logoutSuccess) {
      //   navigate("/");
      // }
      // // navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 backdrop-blur-xl shadow-2xl">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-around h-16">
          {/* Desktop Links */}
          <div className="flex items-center space-x-10">
            <div>
              <Link
                to="/"
                className="flex items-baseline border-l-2 border-t-2"
              >
                <img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-auto dark:invert-100 m-1"
                />
                <p className="sm:block hidden">JobDiary</p>
              </Link>
            </div>
            <div>
              <Link
                to="/job"
                className="md:flex hidden items-center space-x-2 p-2 m-1 border-r-2 border-b-2"
              >
                <AiFillProject size={24} />
                <p>JOB LIST</p>
              </Link>
            </div>
          </div>
          {/* <div className="flex items-center justify-center">
            <input
              type="search"
              placeholder="Input Search"
              className="hidden sm:block bg-slate-50 rounded-2xl p-2 dark:text-cyan-900"
            />
            <button className="flex outline-sky-400 rounded-2xl bg-slate-50 p-2 dark:text-cyan-900">
              <AiOutlineSearch size={24} />
              Search
            </button>
          </div> */}

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthSuccess ? (
              <MenuProfile
                profileLinks={profileLinks}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
                isOpen={activeDropdown === "profile"}
                onOpen={() => openDropdown("profile")}
                onClose={closeDropdown}
                dropdownRef={profileRef}
              />
            ) : (
              <div className="flex space-x-4">
                <SignIn
                  isOpen={activeDropdown === "signin"}
                  onOpen={() => openDropdown("signin")}
                  onClose={closeDropdown}
                  dropdownRef={signInRef}
                />
                <SignUp
                  isOpen={activeDropdown === "signup"}
                  onOpen={() => openDropdown("signup")}
                  onClose={closeDropdown}
                  dropdownRef={signUpRef}
                />
              </div>
            )}
            {isAuthLoading && (
              <div className="text-sm text-gray-500">Loading...</div>
            )}

            <div className="flex items-center">
              <ThemeToggle />
              <Link
                to="/register_company"
                className="border-r-2 border-t-2 p-2 m-1"
              >
                <AiFillGift size={24} />
              </Link>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-sky-900 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden shadow-md px-4 py-2">
            <div className="flex flex-col space-y-2">
              <Link
                to="/job"
                className="p-2 text-gray-700 hover:bg-sky-100 hover:text-sky-900 rounded-md"
                onClick={closeMobileMenu}
              >
                JOB LIST
              </Link>
              {isAuthSuccess ? (
                <>
                  {profileLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="p-2 text-gray-700 hover:bg-sky-100 hover:text-sky-900 rounded-md"
                      onClick={closeMobileMenu}
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
                <>
                  <Link
                    to="/signin"
                    className="p-2 text-gray-700 hover:bg-sky-100 hover:text-sky-900 rounded-md"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="p-2 text-gray-700 hover:bg-sky-100 hover:text-sky-900 rounded-md"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </>
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
