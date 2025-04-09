import React, { useEffect, useRef, useState } from "react";
import { useLoginMutation } from "../../redux/api/authApi";

const SignIn = () => {
  const [email, setEmail] = useState("xyz@mail.com");
  const [password, setPassword] = useState("abc");
  const [formError, setFormError] = useState(""); // For basic validation errors

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

  // Focus on email input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Handle form submission
  const handleOnSubmit = (e) => {
    e.preventDefault();
    setFormError(""); // Reset form errors

    // Basic validation
    if (!email) {
      setFormError("Email is required");
      return;
    }
    if (!password) {
      setFormError("Password is required");
      return;
    }

    // Trigger login mutation
    login({ email, password });
  };

  // Render based on login state
  if (isLogin) return <p>Loading...</p>;

  if (isLoginSuccess) {
    return <p>Successfully logged in!</p>;
  }

  if (isLoginError) {
    return (
      <p>Login failed. {loginError?.data?.message || "Please try again."}</p>
    );
  }

  return (
    <div>
      <h1>Company SignIn</h1>
      <form onSubmit={handleOnSubmit}>
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
        </div>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        <button type="submit" disabled={isLogin}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
