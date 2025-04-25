import React, { useEffect, useRef, useState } from "react";
import { useRegisterMutation } from "../../redux/api/authApi";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const [username, setUsername] = useState("xyz");
  const [email, setEmail] = useState("xyz@mail.com");
  const [password, setPassword] = useState("abc");
  const [confirmPassword, setConfirmPassword] = useState("abc");
  const [formError, setFormError] = useState("");

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

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!username) {
      setFormError("Username is required");
      return;
    }

    if (!email) {
      setFormError("Email is required");
      return;
    }
    if (!password) {
      setFormError("Password is required");
      return;
    }
    if (!confirmPassword) {
      setFormError("confirmPassword is required");
      return;
    }
    if (password === confirmPassword) {
      register({ username, email, password, confirmPassword });
    }

    // register({ email, password, confirmPassword });
  };

  // Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send the Google ID token to the backend
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        // Assuming the backend returns tokens similar to regular login
        console.log("Google login successful:", data);
        // You might want to store tokens or redirect
        login({ accessToken: data.accessToken }); // Adjust based on your auth flow
      } else {
        setFormError(data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setFormError("Error during Google login");
    }
  };

  // if (isRegister) return <p>Loading...</p>;
  // if (isRegisterSuccess) return <p>Successfully logged in!</p>;
  if (isRegisterError)
    return (
      <p>
        Register failed. {registerError?.data?.message || "Please try again."}
      </p>
    );

  return (
    <div>
      <h1>Company SignUp</h1>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("Google Login Failed");
          setFormError("Google Login Failed");
        }}
      />
      <form onSubmit={handleOnSubmit}>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            ref={usernameRef}
          />
        </div>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            ref={emailInputRef}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            ref={passwordInputRef}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="confirmPassword"
            ref={confirmPasswordRef}
          />
        </div>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        <button type="submit" disabled={isRegister}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
