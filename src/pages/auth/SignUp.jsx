import React, { useEffect, useRef, useState } from "react";
import { useRegisterMutation } from "../../redux/api/authApi";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const usernameRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [
    register,
    {
      isLoading: isRegister,
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
      error: registerError,
    },
  ] = useRegisterMutation();

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isRegisterSuccess) {
      setFormSuccess("Registration successful! Please log in.");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // Optionally redirect: window.location.href = "/login";
    }
    if (isRegisterError) {
      setFormError(
        registerError?.data?.message || "Registration failed. Please try again."
      );
    }
  }, [isRegisterSuccess, isRegisterError, registerError]);

  const validateForm = () => {
    if (!username) return "Username is required";
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email format";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!confirmPassword) return "Confirm Password is required";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    register({ username, email, password });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Google login successful:", data);
        setFormSuccess("Google registration successful!");
        // Adjust based on your auth flow, e.g., store tokens or redirect
        // Example: localStorage.setItem("accessToken", data.accessToken);
        // window.location.href = "/dashboard";
      } else {
        setFormError(data.message || "Google registration failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setFormError("Error during Google registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 backdrop-blur-3xl bg-white bg-opacity-10 shadow-2xl rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sign Up
        </h1>
        <div className="mb-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log("Google Login Failed");
              setFormError("Google Login Failed");
            }}
            theme="filled_blue"
            size="large"
            text="signup_with"
          />
        </div>
        <div className="flex items-center justify-center mb-4">
          <span className="text-gray-500">or</span>
        </div>
        <form onSubmit={handleOnSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              ref={usernameRef}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-describedby={formError && "username-error"}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              ref={emailInputRef}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-describedby={formError && "email-error"}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              ref={passwordInputRef}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-describedby={formError && "password-error"}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Fixed bug
              placeholder="Confirm your password"
              ref={confirmPasswordRef}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-describedby={formError && "confirmPassword-error"}
            />
          </div>
          {formError && (
            <p id="form-error" className="text-red-500 text-sm" role="alert">
              {formError}
            </p>
          )}
          {formSuccess && (
            <p
              id="form-success"
              className="text-green-500 text-sm"
              role="status"
            >
              {formSuccess}
            </p>
          )}
          <button
            type="submit"
            disabled={isRegister}
            className={`w-full p-2 rounded-md text-white ${
              isRegister
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isRegister ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp; // import React, { useEffect, useRef, useState } from "react";
// import { useRegisterMutation } from "../../redux/api/authApi";
// import { GoogleLogin } from "@react-oauth/google";

// const SignUp = () => {
//   const [username, setUsername] = useState("xyz");
//   const [email, setEmail] = useState("xyz@mail.com");
//   const [password, setPassword] = useState("abc");
//   const [confirmPassword, setConfirmPassword] = useState("abc");
//   const [formError, setFormError] = useState("");

//   const usernameRef = useRef(null);
//   const emailInputRef = useRef(null);
//   const passwordInputRef = useRef(null);
//   const confirmPasswordRef = useRef(null);

//   const [
//     register,
//     {
//       isLoading: isRegister,
//       isSuccess: isRegisterSuccess,
//       isError: isRegisterError,
//       error: registerError,
//     },
//   ] = useRegisterMutation();

//   useEffect(() => {
//     if (emailInputRef.current) {
//       emailInputRef.current.focus();
//     }
//   }, []);

//   const handleOnSubmit = (e) => {
//     e.preventDefault();
//     setFormError("");

//     if (!username) {
//       setFormError("Username is required");
//       return;
//     }

//     if (!email) {
//       setFormError("Email is required");
//       return;
//     }
//     if (!password) {
//       setFormError("Password is required");
//       return;
//     }
//     if (!confirmPassword) {
//       setFormError("confirmPassword is required");
//       return;
//     }
//     if (password === confirmPassword) {
//       register({ username, email, password, confirmPassword });
//     }

//     // register({ email, password, confirmPassword });
//   };

//   // Handle Google Login Success
//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       // Send the Google ID token to the backend
//       const response = await fetch("/api/auth/google", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ token: credentialResponse.credential }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         // Assuming the backend returns tokens similar to regular login
//         console.log("Google login successful:", data);
//         // You might want to store tokens or redirect
//         login({ accessToken: data.accessToken }); // Adjust based on your auth flow
//       } else {
//         setFormError(data.message || "Google login failed");
//       }
//     } catch (error) {
//       console.error("Google login error:", error);
//       setFormError("Error during Google login");
//     }
//   };

//   if (isRegister) return <p>Loading...</p>;
//   if (isRegisterSuccess) return <p>Successfully logged in!</p>;
//   if (isRegisterError)
//     return (
//       <p>
//         Register failed. {registerError?.data?.message || "Please try again."}
//       </p>
//     );

//   return (
//     <div>
//       <h1>Company SignUp</h1>
//       <GoogleLogin
//         onSuccess={handleGoogleSuccess}
//         onError={() => {
//           console.log("Google Login Failed");
//           setFormError("Google Login Failed");
//         }}
//       />
//       <form onSubmit={handleOnSubmit}>
//         <div>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Username"
//             ref={usernameRef}
//           />
//         </div>
//         <div>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             ref={emailInputRef}
//           />
//         </div>
//         <div>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             ref={passwordInputRef}
//           />
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="confirmPassword"
//             ref={confirmPasswordRef}
//           />
//         </div>
//         {formError && <p style={{ color: "red" }}>{formError}</p>}
//         <button type="submit" disabled={isRegister}>
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignUp;
