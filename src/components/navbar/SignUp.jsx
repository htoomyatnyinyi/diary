import React, { useState } from "react";
import { Link } from "react-router-dom";
import useToggleDropdown from "../../hooks/useToggleDropdown";
import { useRegisterMutation } from "../../redux/api/authApi";

const SignUp = () => {
  const [
    register,
    {
      isLoading: isRegisterLoading,
      isError: isRegisterError,
      error: registerError,
    },
  ] = useRegisterMutation();

  const { isOpen, toggle, close, dropdownRef } = useToggleDropdown();
  const [username, setUsername] = useState("xyz");
  const [email, setEmail] = useState("xyz@mail.com");
  const [password, setPassword] = useState("abc");
  const [confirmPassword, setConfirmPassword] = useState("abc");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your sign-up logic here (e.g., dispatch an auth action)
    console.log("Sign Up:", { username, email, password, confirmPassword });
    register({ username, email, password, confirmPassword });
    close(); // Close dropdown after submission
  };

  return (
    <div>
      <button
        onClick={toggle}
        className="p-2 m-1 dark:bg-white dark:text-cyan-900 bg-cyan-900 text-white border-r-2 border-b-2"
      >
        Sign Up
      </button>
      {isOpen && <div className="fixed inset-0 z-30" onClick={close}></div>}
      <div
        ref={dropdownRef}
        className={`fixed right-0 top-14 shadow-2xl z-40 bg-cyan-900 text-white dark:bg-white dark:text-cyan-900 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 w-64">
          <h3 className="text-lg font-semibold mb-4">Sign Up</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm">
                Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-100 dark:text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-100 dark:text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-100 dark:text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm">
                confirmPassword
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-100 dark:text-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-sky-600 text-white hover:bg-sky-700 rounded"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-sm">
            Already have an account?
            <Link to="/signin" className="underline" onClick={close}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
