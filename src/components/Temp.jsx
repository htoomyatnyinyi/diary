import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";
import useMobileMenu from "../../hooks/useMobileMenu";
import MenuProfile from "./MenuProfile";
import SignIn from "./SignIn"; // Assuming SignIn handles the actual login mutation
import SignUp from "./SignUp";

import logo from "../../assets/utils/1.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { AiFillGift, AiFillProject } from "react-icons/ai";

// Assuming RTK Query setup provides these hooks
import { useAuthMeQuery, useLogoutMutation } from "../../redux/api/authApi";

const Navigation = () => {
  const navigate = useNavigate();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useMobileMenu();

  // Fetch user data - isAuthSuccess reflects if we successfully got user info (i.e., logged in)
  const {
    data: userData,
    isLoading: isAuthLoading, // You might want to use this for loading indicators
    isSuccess: isAuthSuccess,
    // isError: isAuthError, // Consider handling auth errors
  } = useAuthMeQuery(null);

  // Logout mutation hook
  const [logout, { isLoading: isLoggingOut, isSuccess: logoutSuccess }] = // Keep logoutSuccess if needed elsewhere, but direct navigation is often preferred
    useLogoutMutation();

  const role = userData?.user?.role;

  // Manage dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null); // null, "profile", "signin", "signup"
  const profileRef = useRef(null);
  const signInRef = useRef(null);
  const signUpRef = useRef(null);

  // Ref to track previous authentication state for login detection
  const prevIsAuthSuccess = useRef(isAuthSuccess);

  const openDropdown = (dropdown) => setActiveDropdown(dropdown);
  const closeDropdown = () => setActiveDropdown(null);

  // --- Effect Hooks ---

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside all potential dropdown trigger/content areas
      const isOutsideProfile = profileRef.current && !profileRef.current.contains(event.target);
      const isOutsideSignIn = signInRef.current && !signInRef.current.contains(event.target);
      const isOutsideSignUp = signUpRef.current && !signUpRef.current.contains(event.target);

      // Additional check: Ensure the click wasn't on the buttons that *open* the dropdowns
      // This requires references to the trigger buttons themselves if they aren't part of the dropdown content refs.
      // For simplicity, assuming the current ref checks are sufficient for typical dropdown structures.
      // If dropdowns close unexpectedly when clicking their triggers, you might need more refined logic here.

      if (isOutsideProfile && isOutsideSignIn && isOutsideSignUp) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // No dependencies needed if refs don't change

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []); // No dependencies needed

  // --- Effect for Post-Login Actions ---
  useEffect(() => {
    // Check if authentication status just became successful (was false, now true)
    if (isAuthSuccess && !prevIsAuthSuccess.current) {
      console.log("Login detected, closing dropdowns and navigating.");
      closeDropdown(); // Close signin/signup dropdowns if they were open
      closeMobileMenu(); // Close mobile menu if open

      // Navigate to the appropriate dashboard after successful login
      // Ensure userData and role are available before navigating
      if (role) {
        const dashboardPath = role === "employer" ? "/dashboard/employer" : "/user/dashboard";
        console.log(`Navigating to ${dashboardPath}`);
        navigate(dashboardPath);
      } else {
        // Fallback navigation if role isn't immediately available after isAuthSuccess turns true
        console.log("Role not available yet, navigating to home /");
        navigate("/");
      }
    }

    // Update the ref *after* the check for the next render cycle
    prevIsAuthSuccess.current = isAuthSuccess;

  }, [isAuthSuccess, role, navigate, closeMobileMenu]); // Add dependencies: isAuthSuccess, role, navigate, closeMobileMenu

  // --- Profile Links Configuration ---
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
      ? [{ name: "MANAGEMENT", path: "/employer/post-job" }] // Example path
      : []),
    { name: "SETTINGS", path: "/settings" }, // Generic settings path
  ];

  // --- Logout Handler ---
  const handleLogout = async () => {
    try {
      console.log("Attempting logout...");
      await logout().unwrap(); // unwrap handles success/error based on promise resolution/rejection
      // If unwrap() doesn't throw, the logout was successful
      console.log("Logout successful via API.");
      closeDropdown(); // Close profile dropdown if open
      closeMobileMenu(); // Ensure mobile menu is closed
      console.log("Navigating to / after logout.");
      navigate("/"); // Navigate to home page immediately after successful logout
      // NOTE: No need to explicitly check `logoutSuccess` here if using `unwrap()`.
      // The navigation happens only if the await succeeds.
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally: Show an error message to the user
    }
  };

  // --- Render Logic ---
  return (
    <nav className="fixed top-0 left-0 w-full z-30 backdrop-blur-xl shadow-2xl bg-white/80 dark:bg-gray-900/80"> {/* Added example background for blur */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-around h-16">
          {/* Desktop Links - Left */}
          <div className="flex items-center space-x-10">
            <div>
              <Link
                to="/"
                className="flex items-baseline border-l-2 border-t-2 p-1 rounded-tl-lg dark:text-white" // Added padding and rounding
                onClick={() => { closeMobileMenu(); closeDropdown(); }} // Close menus on logo click
              >
                <img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-auto dark:invert m-1" // Applied dark mode invert
                />
                <p className="sm:block hidden font-semibold">JobDiary</p> {/* Added font weight */}
              </Link>
            </div>
            <div>
              <Link
                to="/job"
                className="md:flex hidden items-center space-x-2 p-2 m-1 border-r-2 border-b-2 rounded-br-lg text-gray-700 dark:text-gray-300 hover:text-sky-700 dark:hover:text-sky-400" // Added text colors and hover
                onClick={() => { closeMobileMenu(); closeDropdown(); }}
              >
                <AiFillProject size={24} />
                <p>JOB LIST</p>
              </Link>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthSuccess ? ( // Use isAuthSuccess to determine authentication
              <MenuProfile
                profileLinks={profileLinks}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
                isOpen={activeDropdown === "profile"}
                onOpen={() => openDropdown("profile")}
                onClose={closeDropdown}
                dropdownRef={profileRef} // Pass the ref
              />
            ) : (
              // Show Sign In / Sign Up only if not authenticated and auth check isn't loading
              !isAuthLoading && (
                <div className="flex space-x-4">
                  <SignIn
                    isOpen={activeDropdown === "signin"}
                    onOpen={() => openDropdown("signin")}
                    onClose={closeDropdown}
                    dropdownRef={signInRef} // Pass the ref
                    // Pass closeDropdown or a specific success handler if SignIn needs to close itself
                    onLoginSuccess={() => {
                      // This might be redundant if the useEffect handles it,
                      // but can provide immediate feedback within SignIn component
                      closeDropdown();
                    }}
                  />
                  <SignUp
                    isOpen={activeDropdown === "signup"}
                    onOpen={() => openDropdown("signup")}
                    onClose={closeDropdown}
                    dropdownRef={signUpRef} // Pass the ref
                     // Pass closeDropdown or a specific success handler
                    onSignUpSuccess={() => {
                       closeDropdown();
                       // Optionally navigate to sign-in or a confirmation page
                    }}
                  />
                </div>
              )
            )}
            {/* Show loading indicator while checking auth status */}
            {isAuthLoading && <div className="text-sm text-gray-500">Loading...</div>}

            {/* Theme Toggle and Gift Icon */}
            <div className="flex items-center">
              <ThemeToggle />
              <Link
                to="/register_company" // Consider if this link should be conditional based on auth/role
                className="border-r-2 border-t-2 p-2 m-1 rounded-tr-lg text-gray-700 dark:text-gray-300 hover:text-sky-700 dark:hover:text-sky-400" // Style consistency
                onClick={() => { closeMobileMenu(); closeDropdown(); }}
                aria-label="Register Company / Gift"
              >
                <AiFillGift size={24} />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             {/* Optionally add ThemeToggle here for mobile too if not in the menu */}
             {/* <ThemeToggle />  */}
             <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-sky-900 dark:hover:text-sky-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500" // Added focus style
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen} // Accessibility
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* --- Mobile Menu --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden shadow-lg border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 pt-2 pb-3 space-y-1 sm:px-3"> {/* Added background and padding */}
            {/* Job List Link */}
            <Link
              to="/job"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-gray-700 hover:text-sky-900 dark:hover:text-white"
              onClick={closeMobileMenu} // Close menu on click
            >
              JOB LIST
            </Link>

            {/* Conditional Links based on Auth */}
            {isAuthLoading ? (
               <div className="px-3 py-2 text-base font-medium text-gray-500">Checking status...</div>
            ) : isAuthSuccess ? ( // Use isAuthSuccess
              <>
                {profileLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-gray-700 hover:text-sky-900 dark:hover:text-white"
                    onClick={closeMobileMenu} // Close menu on click
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout} // Logout calls the updated handler
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-700 hover:text-red-900 dark:hover:text-red-300"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                {/* Sign In/Up Links for Mobile */}
                <Link
                  to="/signin" // Assuming you have routes for these pages
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-gray-700 hover:text-sky-900 dark:hover:text-white"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup" // Assuming you have routes for these pages
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-gray-700 hover:text-sky-900 dark:hover:text-white"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
             {/* Mobile Theme Toggle Separated */}
             <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-3">
                    <span className="text-gray-600 dark:text-gray-400 mr-2">Theme:</span>
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