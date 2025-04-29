import React, { useEffect, useRef, useState } from "react";
import {
  useGoogleLoginMutation,
  useLoginMutation,
} from "../../redux/api/authApi";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("xyz@mail.com");
  const [password, setPassword] = useState("abc");
  const [formError, setFormError] = useState("");

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const [
    login,
    {
      isLoading: isLogin,
      isSuccess: isLoginSuccess,
      isError: isLoginError,
      error: loginError,
    },
  ] = useLoginMutation();

  const [
    googleLogin,
    {
      isLoading: isGoogleLoginLoading,
      isSuccess: isGoogleLoginSuccess,
      isError: isGoogleLoginError,
      error: googleLoginError,
    },
  ] = useGoogleLoginMutation();

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isGoogleLoginError) {
      setFormError(
        googleLoginError?.data?.message ||
          "Google login failed. Please try again."
      );
    }
    if (isGoogleLoginSuccess) {
      setFormError("");
    }
  }, [isGoogleLoginError, googleLoginError, isGoogleLoginSuccess]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!email) {
      setFormError("Email is required");
      return;
    }
    if (!password) {
      setFormError("Password is required");
      return;
    }

    login({ email, password });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google credential response:", credentialResponse);
    setFormError("");

    try {
      await googleLogin({ token: credentialResponse.credential }).unwrap();
      console.log("Google login mutation successful");
    } catch (error) {
      console.error("Google login mutation error:", error);
      setFormError(error?.data?.message || "Error during Google login");
    }
  };

  if (isLogin || isGoogleLoginLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-8 w-8 text-lime-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
            ></path>
          </svg>
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  // if (isLoginSuccess || isGoogleLoginSuccess) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //       <p className="text-center text-lg text-cyan-600 animate-fade-in">
  //         Successfully logged in! Redirecting...
  //       </p>
  //     </div>
  //   );
  // }

  // if (isLoginError) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //       <p className="text-center text-lg text-red-600">
  //         Login failed. {loginError?.data?.message || "Please try again."}
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl  shadow-lg rounded-lg overflow-hidden transform transition-all hover:shadow-2xl">
        {/* Left Section - Description */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-400 to-cyan-600 p-8 flex flex-col justify-center text-white">
          <h1 className="text-3xl font-bold mb-4 animate-fade-in">
            Welcome Back
          </h1>
          <p className="text-lg animate-fade-in">
            Sign in to access your account and explore our services. We're
            excited to have you here!
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-8 bg-white text-cyan-900">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Company Sign In
          </h1>
          <form onSubmit={handleOnSubmit} className="space-y-6">
            <div className="relative">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log("Google Login Failed");
                  setFormError("Google Login Failed");
                }}
                text="signin_with"
                shape="pill"
                disabled={isGoogleLoginLoading}
                width="100%"
              />
              {isGoogleLoginLoading && (
                <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50 rounded-full">
                  <svg
                    className="animate-spin h-5 w-5 text-lime-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>

            <div className="text-center">OR</div>

            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                ref={emailInputRef}
                className={`w-full p-3 border ${
                  formError.includes("Email")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-lime-500"
                } rounded-md focus:outline-none focus:ring-2 transition`}
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                ref={passwordInputRef}
                className={`w-full p-3 border ${
                  formError.includes("Password")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-900 focus:ring-lime-500"
                } rounded-md focus:outline-none focus:ring-2 transition`}
              />
            </div>

            {formError && (
              <p className="text-red-500 text-sm text-center animate-pulse">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLogin}
              className="w-full bg-lime-500 text-white p-3 rounded-md hover:bg-lime-600 disabled:bg-lime-300 transition transform hover:scale-105 flex items-center justify-center"
            >
              {isLogin ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="text-lime-500 hover:underline text-sm"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-lime-500 hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
