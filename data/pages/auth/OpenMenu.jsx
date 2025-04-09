import React, { useRef, forwardRef } from "react"; // Make sure to import useRef and forwardRef

const OpenMenu = forwardRef((props, ref) => {
  // Refs for input fields
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  // --- Add Ref for the select element ---
  const selectionRef = useRef(null);

  // --- Function to GET values (like for submission) ---
  const handleSubmit = () => {
    // Access the current value of the DOM elements
    const username = usernameRef.current ? usernameRef.current.value : "";
    const email = emailRef.current ? emailRef.current.value : "";
    const password = passwordRef.current ? passwordRef.current.value : "";
    const confirmPassword = confirmPasswordRef.current
      ? confirmPasswordRef.current.value
      : "";
    // --- Get the selected value from the select element ---
    const selectedOption = selectionRef.current
      ? selectionRef.current.value
      : "";

    console.log("Submit clicked!");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    // --- Log the selected value ---
    console.log("Selected Option:", selectedOption);

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare data for submission, including the selection
    const formData = {
      username,
      email,
      password,
      selectedOption: selectedOption, // Add selection to form data
    };
    console.log("Form Data:", formData);

    // Your actual submission logic here...
    // fetch('/api/register', { method: 'POST', body: JSON.stringify(formData), ... })
  };

  // --- Function to SET values programmatically using refs ---
  const handlePrefillData = () => {
    console.log("Prefilling data...");
    if (usernameRef.current) {
      usernameRef.current.value = "DefaultUser"; // Set username input value
    }
    if (emailRef.current) {
      emailRef.current.value = "default@example.com"; // Set email input value
    }
    if (selectionRef.current) {
      // Set select value - must match one of the <option> values
      selectionRef.current.value = "hello_value";
    }
    // You can also set password fields, but be cautious about pre-filling sensitive data
    // if (passwordRef.current) {
    //   passwordRef.current.value = "password123";
    // }
    // if (confirmPasswordRef.current) {
    //   confirmPasswordRef.current.value = "password123";
    // }

    // Optionally, focus on the first field after prefilling
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  };

  return (
    <div
      ref={ref} // Parent ref attached here
      className="absolute right-10 shadow-2xl w-72 h-auto p-4 bg-green-400 overflow-y-auto backdrop-blur-3xl flex flex-col gap-2" // Added h-auto, flex, gap
    >
      <h1>This is testing OpenMenu</h1>

      <input type="text" ref={usernameRef} placeholder="Username..." />
      <input type="email" ref={emailRef} placeholder="Email..." />
      <input type="password" ref={passwordRef} placeholder="Password..." />
      <input
        type="password"
        ref={confirmPasswordRef}
        placeholder="Confirm Password..."
      />

      {/* --- Attach ref to select and add value attributes to options --- */}
      <select ref={selectionRef}>
        {/* It's good practice to provide explicit value attributes */}
        <option value="">-- Select One --</option> {/* Default empty option */}
        <option value="hi_value">Hi</option>
        <option value="hello_value">Hello</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-1 rounded"
      >
        Submit
      </button>
      {/* --- Add a button to trigger the update function --- */}
      <button
        onClick={handlePrefillData}
        className="bg-yellow-500 text-black p-1 rounded"
      >
        Prefill Data
      </button>
    </div>
  );
});

export default OpenMenu;
