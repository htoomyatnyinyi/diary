import React, { useState, useEffect } from "react";
import { useCreateNewJobMutation } from "../../../redux/api/jobApi";

// Helper component for list input (Requirements/Responsibilities)
const ListInput = ({ label, placeholder, items, setItems }) => {
  const [currentItem, setCurrentItem] = useState("");

  const handleAddItem = (e) => {
    // Prevent adding if triggered by Enter key in the input itself if needed
    if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
      e.preventDefault(); // Prevent form submission if inside form
      if (currentItem.trim()) {
        setItems([...items, currentItem.trim()]);
        setCurrentItem("");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddItem(e);
    }
  };

  const handleRemoveItem = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          placeholder={placeholder}
          value={currentItem}
          onChange={(e) => setCurrentItem(e.target.value)}
          onKeyDown={handleKeyDown} // Add item on Enter key
          className="flex-grow p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
        />
        <button
          type="button" // Important: type="button" to prevent form submission
          onClick={handleAddItem}
          className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded text-sm"
        >
          Add
        </button>
      </div>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 pl-4">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between items-center group">
            <span>{item}</span>
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 hover:text-red-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remove
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-gray-400 italic">
            No {label.toLowerCase()} added yet.
          </li>
        )}
      </ul>
    </div>
  );
};

// Main Sidebar Component
const CreateNewJob = ({ isOpen, onClose }) => {
  const [createNewJob, { isLoading: isCreating, isSuccess: isCreateSuccess }] =
    useCreateNewJobMutation();

  const initialFormData = {
    title: "",
    description: "",
    salary_min: "",
    salary_max: "",
    location: "",
    address: "",
    employment_type: "",
    category: "",
    application_deadline: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [requirements, setRequirements] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);
  const [postImage, setPostImage] = useState(null); // State for the file
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Reset form when sidebar closes or on successful submission
  useEffect(() => {
    if (!isOpen) {
      // Optionally delay reset slightly for closing animation
      setTimeout(() => {
        setFormData(initialFormData);
        setRequirements([]);
        setResponsibilities([]);
        setPostImage(null);
        setError(null);
        setSuccess(null);
        setIsLoading(false);
      }, 300); // Match transition duration
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPostImage(e.target.files[0]);
    } else {
      setPostImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Create FormData object for multipart/form-data
    const submissionData = new FormData();

    // Append standard form fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        // Avoid sending empty strings if not desired, or handle nulls explicitly
        submissionData.append(key, formData[key]);
      }
    });

    // Append requirements and responsibilities as JSON strings
    submissionData.append("requirements", JSON.stringify(requirements));
    submissionData.append("responsibilities", JSON.stringify(responsibilities));

    // Append the file if selected
    if (postImage) {
      submissionData.append("post_image", postImage); // Key matches backend 'req.files?.post_image'
    }
    console.log(submissionData, "check at submit");
    try {
      createNewJob(submissionData);
      // // Replace '/api/jobs' with your actual endpoint
      // // Make sure to include authentication headers if needed
      // const response = await fetch("/api/jobs", {
      //   method: "POST",
      //   body: submissionData,
      //   // !! DO NOT set Content-Type header manually when using FormData !!
      //   // The browser will set it correctly, including the boundary.
      //   // headers: { 'Authorization': `Bearer ${yourAuthToken}` } // Example auth header
      // });

      // const result = await response.json();

      // if (!response.ok || !result.success) {
      //   // Use message from backend response if available
      //   throw new Error(
      //     result.message || `HTTP error! status: ${response.status}`
      //   );
      // }
      // if(isCreateSuccess)

      // setSuccess(`Job created successfully! ID: ${result.id}`);
      // // Optionally reset form fields here if you don't want to wait for close
      // // setFormData(initialFormData); setRequirements([]); ...
      // // Consider closing the sidebar automatically after success
      setTimeout(() => {
        onClose(); // Close the sidebar via the prop function
      }, 1500); // Give user time to see success message
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Define options for select dropdowns (example)
  const employmentTypeOptions = [
    "full_time",
    "part_time",
    "contract",
    "internship",
    "apprenticeship",
  ];

  const categoryOptions = [
    "Technology",
    "Marketing",
    "Sales",
    "Design",
    "Human Resources",
    "Finance",
    "Customer Service",
    "Other",
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`pt-16 fixed inset-0 backdrop-blur-3xl  z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose} // Close sidebar when clicking overlay
      ></div>

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5  shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`} // Added overflow-y-auto
      >
        <div className="p-6">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Create New Job
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-2xl"
              aria-label="Close sidebar"
            >
              &times; {/* Close icon */}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Job Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Senior React Developer"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Provide a detailed description..."
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Requirements List Input */}
            <ListInput
              label="Requirements"
              placeholder="Add a requirement..."
              items={requirements}
              setItems={setRequirements}
            />

            {/* Responsibilities List Input */}
            <ListInput
              label="Responsibilities"
              placeholder="Add a responsibility..."
              items={responsibilities}
              setItems={setResponsibilities}
            />

            {/* Salary Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="salary_min"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Min Salary ($)
                </label>
                <input
                  type="number"
                  id="salary_min"
                  name="salary_min"
                  placeholder="e.g., 60000"
                  value={formData.salary_min}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="salary_max"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Max Salary ($)
                </label>
                <input
                  type="number"
                  id="salary_max"
                  name="salary_max"
                  placeholder="e.g., 90000"
                  value={formData.salary_max}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g., Remote, New York"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Address (Optional) */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Specific Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="e.g., 123 Main St (Optional)"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Employment Type */}
            <div>
              <label
                htmlFor="employment_type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Employment Type *
              </label>
              <select
                id="employment_type"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                <option value="" disabled>
                  Select type...
                </option>
                {employmentTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                <option value="" disabled>
                  Select category...
                </option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Application Deadline */}
            <div>
              <label
                htmlFor="application_deadline"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Application Deadline
              </label>
              <input
                type="date"
                id="application_deadline"
                name="application_deadline"
                value={formData.application_deadline}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Post Image Upload */}
            <div>
              <label
                htmlFor="post_image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Featured Image (Optional)
              </label>
              <input
                type="file"
                id="post_image"
                name="post_image" // Name attribute matches backend
                onChange={handleFileChange}
                accept="image/*" // Accept only image files
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              {postImage && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {postImage.name}
                </p>
              )}
            </div>

            {/* Loading/Error/Success Messages */}
            <div className="mt-4 space-y-2">
              {isLoading && (
                <p className="text-center text-blue-600">Submitting...</p>
              )}
              {error && (
                <p className="text-center text-red-600 bg-red-100 p-2 rounded">
                  Error: {error}
                </p>
              )}
              {success && (
                <p className="text-center text-green-600 bg-green-100 p-2 rounded">
                  {success}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading} // Disable button while loading
                className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating..." : "Create Job Posting"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateNewJob;
// import React, { useState, useEffect } from "react";
// import { useCreateNewJobMutation } from "../../../redux/api/jobApi";

// // Helper component for list input (Requirements/Responsibilities)
// const ListInput = ({ label, placeholder, items, setItems }) => {
//   const [currentItem, setCurrentItem] = useState("");

//   const handleAddItem = (e) => {
//     // Prevent adding if triggered by Enter key in the input itself if needed
//     if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
//       e.preventDefault(); // Prevent form submission if inside form
//       if (currentItem.trim()) {
//         setItems([...items, currentItem.trim()]);
//         setCurrentItem("");
//       }
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleAddItem(e);
//     }
//   };

//   const handleRemoveItem = (indexToRemove) => {
//     setItems(items.filter((_, index) => index !== indexToRemove));
//   };

//   return (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//       </label>
//       <div className="flex items-center space-x-2 mb-2">
//         <input
//           type="text"
//           placeholder={placeholder}
//           value={currentItem}
//           onChange={(e) => setCurrentItem(e.target.value)}
//           onKeyDown={handleKeyDown} // Add item on Enter key
//           className="flex-grow p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//         />
//         <button
//           type="button" // Important: type="button" to prevent form submission
//           onClick={handleAddItem}
//           className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded text-sm"
//         >
//           Add
//         </button>
//       </div>
//       <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 pl-4">
//         {items.map((item, index) => (
//           <li key={index} className="flex justify-between items-center group">
//             <span>{item}</span>
//             <button
//               type="button"
//               onClick={() => handleRemoveItem(index)}
//               className="text-red-500 hover:text-red-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               Remove
//             </button>
//           </li>
//         ))}
//         {items.length === 0 && (
//           <li className="text-gray-400 italic">
//             No {label.toLowerCase()} added yet.
//           </li>
//         )}
//       </ul>
//     </div>
//   );
// };

// // Main Sidebar Component
// const CreateNewJob = ({ isOpen, onClose }) => {
//   const [createNewJob] = useCreateNewJobMutation();

//   const initialFormData = {
//     title: "",
//     description: "",
//     salary_min: "",
//     salary_max: "",
//     location: "",
//     address: "",
//     employment_type: "",
//     category: "",
//     application_deadline: "",
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [requirements, setRequirements] = useState([]);
//   const [responsibilities, setResponsibilities] = useState([]);
//   const [postImage, setPostImage] = useState(null); // State for the file
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Reset form when sidebar closes or on successful submission
//   useEffect(() => {
//     if (!isOpen) {
//       // Optionally delay reset slightly for closing animation
//       setTimeout(() => {
//         setFormData(initialFormData);
//         setRequirements([]);
//         setResponsibilities([]);
//         setPostImage(null);
//         setError(null);
//         setSuccess(null);
//         setIsLoading(false);
//       }, 300); // Match transition duration
//     }
//   }, [isOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setPostImage(e.target.files[0]);
//     } else {
//       setPostImage(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);

//     // Create FormData object for multipart/form-data
//     const submissionData = new FormData();

//     // Append standard form fields
//     Object.keys(formData).forEach((key) => {
//       if (formData[key] !== null && formData[key] !== "") {
//         // Avoid sending empty strings if not desired, or handle nulls explicitly
//         submissionData.append(key, formData[key]);
//       }
//     });

//     // Append requirements and responsibilities as JSON strings
//     submissionData.append("requirements", JSON.stringify(requirements));
//     submissionData.append("responsibilities", JSON.stringify(responsibilities));

//     // Append the file if selected
//     if (postImage) {
//       submissionData.append("post_image", postImage); // Key matches backend 'req.files?.post_image'
//     }
//     console.log(submissionData, "check at submit");
//     try {
//       createNewJob(submissionData);
//       // // Replace '/api/jobs' with your actual endpoint
//       // // Make sure to include authentication headers if needed
//       // const response = await fetch("/api/jobs", {
//       //   method: "POST",
//       //   body: submissionData,
//       //   // !! DO NOT set Content-Type header manually when using FormData !!
//       //   // The browser will set it correctly, including the boundary.
//       //   // headers: { 'Authorization': `Bearer ${yourAuthToken}` } // Example auth header
//       // });

//       // const result = await response.json();

//       // if (!response.ok || !result.success) {
//       //   // Use message from backend response if available
//       //   throw new Error(
//       //     result.message || `HTTP error! status: ${response.status}`
//       //   );
//       // }

//       // setSuccess(`Job created successfully! ID: ${result.id}`);
//       // // Optionally reset form fields here if you don't want to wait for close
//       // // setFormData(initialFormData); setRequirements([]); ...
//       // // Consider closing the sidebar automatically after success
//       // setTimeout(() => {
//       //   onClose(); // Close the sidebar via the prop function
//       // }, 1500); // Give user time to see success message
//     } catch (err) {
//       console.error("Submission error:", err);
//       setError(err.message || "An unexpected error occurred.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Define options for select dropdowns (example)
//   const employmentTypeOptions = [
//     "full_time",
//     "part_time",
//     "contract",
//     "internship",
//     "apprenticeship",
//   ];

//   const categoryOptions = [
//     "Technology",
//     "Marketing",
//     "Sales",
//     "Design",
//     "Human Resources",
//     "Finance",
//     "Customer Service",
//     "Other",
//   ];

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className={`pt-16 fixed inset-0 backdrop-blur-3xl  z-40 transition-opacity duration-300 ${
//           isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={onClose} // Close sidebar when clicking overlay
//       ></div>

//       {/* Sidebar Container */}
//       <div
//         className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5  shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } overflow-y-auto`} // Added overflow-y-auto
//       >
//         <div className="p-6">
//           {/* Header with Close Button */}
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">
//               Create New Job
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800 text-2xl"
//               aria-label="Close sidebar"
//             >
//               &times; {/* Close icon */}
//             </button>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Job Title */}
//             <div>
//               <label
//                 htmlFor="title"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Job Title *
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 placeholder="e.g., Senior React Developer"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Job Description *
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 rows="4"
//                 placeholder="Provide a detailed description..."
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             {/* Requirements List Input */}
//             <ListInput
//               label="Requirements"
//               placeholder="Add a requirement..."
//               items={requirements}
//               setItems={setRequirements}
//             />

//             {/* Responsibilities List Input */}
//             <ListInput
//               label="Responsibilities"
//               placeholder="Add a responsibility..."
//               items={responsibilities}
//               setItems={setResponsibilities}
//             />

//             {/* Salary Range */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label
//                   htmlFor="salary_min"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Min Salary ($)
//                 </label>
//                 <input
//                   type="number"
//                   id="salary_min"
//                   name="salary_min"
//                   placeholder="e.g., 60000"
//                   value={formData.salary_min}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="salary_max"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Max Salary ($)
//                 </label>
//                 <input
//                   type="number"
//                   id="salary_max"
//                   name="salary_max"
//                   placeholder="e.g., 90000"
//                   value={formData.salary_max}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//                 />
//               </div>
//             </div>

//             {/* Location */}
//             <div>
//               <label
//                 htmlFor="location"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Location
//               </label>
//               <input
//                 type="text"
//                 id="location"
//                 name="location"
//                 placeholder="e.g., Remote, New York"
//                 value={formData.location}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             {/* Address (Optional) */}
//             <div>
//               <label
//                 htmlFor="address"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Specific Address
//               </label>
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 placeholder="e.g., 123 Main St (Optional)"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             {/* Employment Type */}
//             <div>
//               <label
//                 htmlFor="employment_type"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Employment Type *
//               </label>
//               <select
//                 id="employment_type"
//                 name="employment_type"
//                 value={formData.employment_type}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500 bg-white"
//               >
//                 <option value="" disabled>
//                   Select type...
//                 </option>
//                 {employmentTypeOptions.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Category */}
//             <div>
//               <label
//                 htmlFor="category"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Job Category
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500 bg-white"
//               >
//                 <option value="" disabled>
//                   Select category...
//                 </option>
//                 {categoryOptions.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Application Deadline */}
//             <div>
//               <label
//                 htmlFor="application_deadline"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Application Deadline
//               </label>
//               <input
//                 type="date"
//                 id="application_deadline"
//                 name="application_deadline"
//                 value={formData.application_deadline}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             {/* Post Image Upload */}
//             <div>
//               <label
//                 htmlFor="post_image"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Featured Image (Optional)
//               </label>
//               <input
//                 type="file"
//                 id="post_image"
//                 name="post_image" // Name attribute matches backend
//                 onChange={handleFileChange}
//                 accept="image/*" // Accept only image files
//                 className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
//               />
//               {postImage && (
//                 <p className="text-xs text-gray-500 mt-1">
//                   Selected: {postImage.name}
//                 </p>
//               )}
//             </div>

//             {/* Loading/Error/Success Messages */}
//             <div className="mt-4 space-y-2">
//               {isLoading && (
//                 <p className="text-center text-blue-600">Submitting...</p>
//               )}
//               {error && (
//                 <p className="text-center text-red-600 bg-red-100 p-2 rounded">
//                   Error: {error}
//                 </p>
//               )}
//               {success && (
//                 <p className="text-center text-green-600 bg-green-100 p-2 rounded">
//                   {success}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={isLoading} // Disable button while loading
//                 className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
//                   isLoading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isLoading ? "Creating..." : "Create Job Posting"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateNewJob;
