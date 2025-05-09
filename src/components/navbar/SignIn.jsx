import React, { useState } from "react";
import { Link } from "react-router-dom";
import useToggleDropdown from "../../hooks/useToggleDropdown";
import { useLoginMutation } from "../../redux/api/authApi";

const SignIn = () => {
  const [
    login,
    {
      isLoading: isLoginLoading,
      isSuccess: loginSuccess,
      isError: isLoginError,
      error: loginError,
    },
  ] = useLoginMutation();

  const { isOpen, toggle, close, dropdownRef } = useToggleDropdown();
  const [email, setEmail] = useState("xyz@mail.com");
  const [password, setPassword] = useState("abc");

  if (isLoginError) return <p>Error</p>;
  if (isLoginLoading) return <p>Loading</p>;
  if (loginError) return <p>Error login</p>;
  if (loginSuccess) return <p>Login Success</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your sign-in logic here (e.g., dispatch an auth action)
    console.log("Sign In:", { email, password });
    login({ email, password });
    close(); // Close dropdown after submission
    // if (loginSuccess === true) {
    //   // Consider navigate to home page automatically after success logout
    //   console.log(loginSuccess);
    //   setTimeout(() => {
    //     navigate("/job");
    //   }, 1000); // Give user time to see success message
    // }
  };

  return (
    <div>
      <button
        onClick={toggle}
        className="p-2 m-1 dark:bg-white dark:text-cyan-900 bg-cyan-900 text-white border-r-2 border-b-2"
      >
        Sign In
      </button>
      {isOpen && <div className="fixed inset-0 z-30" onClick={close}></div>}
      <div
        ref={dropdownRef}
        className={`fixed left-2/3 right-0 top-14 shadow-2xl z-30 
          backdrop-blur-sm p-1
          transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* 
            <div
        ref={dropdownRef}
        className={`fixed inset-0 pt-16 shadow-2xl z-40 bg-cyan-900 text-white
           dark:bg-white dark:text-cyan-900 transition-transform duration-300 ${
             isOpen ? "translate-x-0" : "translate-x-full"
           } `}
      >

        <div
        ref={dropdownRef}
        className={`fixed right-0 top-14 shadow-2xl z-40 bg-cyan-900 text-white dark:bg-white dark:text-cyan-900 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >

      */}
        <div className="p-4 w-64 bg-cyan-900 text-white dark:bg-white dark:text-cyan-900">
          <h3 className="text-lg font-semibold mb-4">Sign In</h3>
          <form onSubmit={handleSubmit}>
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
            <button
              type="submit"
              className="w-full p-2 bg-white dark:bg-cyan-900 text-cyan-900 dark:text-white hover:border-cyan-500 border-2 rounded"
            >
              Sign In
            </button>
          </form>
          {/* <p className="mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="underline" onClick={close}>
              Sign Up
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
