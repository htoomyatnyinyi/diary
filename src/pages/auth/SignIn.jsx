import React, { useEffect, useRef, useState } from "react";
import { useLoginMutation } from "../../redux/api/authApi";
import { GoogleLogin } from "@react-oauth/google";

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

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

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

  if (isLogin) return <p>Loading...</p>;
  if (isLoginSuccess) return <p>Successfully logged in!</p>;
  if (isLoginError)
    return (
      <p>Login failed. {loginError?.data?.message || "Please try again."}</p>
    );

  return (
    <div>
      <h1>Company SignIn</h1>
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

// import React, { useEffect, useRef, useState } from "react";
// import { useLoginMutation } from "../../redux/api/authApi";
// import { GoogleLogin } from "@react-oauth/google";

// const SignIn = () => {
//   const [email, setEmail] = useState("xyz@mail.com");
//   const [password, setPassword] = useState("abc");
//   const [formError, setFormError] = useState(""); // For basic validation errors

//   const emailInputRef = useRef(null);
//   const passwordInputRef = useRef(null);

//   const [
//     login,
//     {
//       isLoading: isLogin,
//       isSuccess: isLoginSuccess,
//       isError: isLoginError,
//       error: loginError,
//     },
//   ] = useLoginMutation();

//   // Focus on email input on mount
//   useEffect(() => {
//     if (emailInputRef.current) {
//       emailInputRef.current.focus();
//     }
//   }, []);

//   // Handle form submission
//   const handleOnSubmit = (e) => {
//     e.preventDefault();
//     setFormError(""); // Reset form errors

//     // Basic validation
//     if (!email) {
//       setFormError("Email is required");
//       return;
//     }
//     if (!password) {
//       setFormError("Password is required");
//       return;
//     }

//     // Trigger login mutation
//     login({ email, password });
//   };

//   // Render based on login state
//   if (isLogin) return <p>Loading...</p>;

//   if (isLoginSuccess) {
//     return <p>Successfully logged in!</p>;
//   }

//   if (isLoginError) {
//     return (
//       <p>Login failed. {loginError?.data?.message || "Please try again."}</p>
//     );
//   }

//   return (
//     <div>
//       <h1>Company SignIn</h1>
//       <GoogleLogin
//         onSuccess={(credentialResponse) => {
//           console.log(credentialResponse);
//         }}
//         onError={() => {
//           console.log("Login Failed");
//         }}
//       />
//       ;
//       <form onSubmit={handleOnSubmit}>
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
//         </div>
//         {formError && <p style={{ color: "red" }}>{formError}</p>}
//         <button type="submit" disabled={isLogin}>
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignIn;
