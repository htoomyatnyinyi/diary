import React, { useState } from "react";
import {
  useGetEmployerProfileQuery,
  useUpdateEmployerProfileMutation,
} from "../../redux/api/employerApi";

export default function EmployerProfile() {
  const { data: profile, isLoading, error } = useGetEmployerProfileQuery();

  const [updateEmployerProfile, { isLoading: isUpdating, error: updateError }] =
    useUpdateEmployerProfileMutation();

  const [editingField, setEditingField] = useState(null); // Tracks which field is being edited
  const [formData, setFormData] = useState({});

  if (isLoading) {
    return <div className="text-center p-6">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        Error loading profile: {error.data?.message || "Something went wrong."}
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center p-6">No profile data available.</div>;
  }

  const handleEdit = (field) => {
    setEditingField(field);
    setFormData({ [field]: profile[field] || "" }); // Initialize with current value
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleSave = async (field) => {
    try {
      await updateEmployerProfile({ [field]: formData[field] }).unwrap();
      setEditingField(null);
      setFormData({});
      alert(`${field.replace("_", " ")} updated successfully!`);
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData({});
  };

  const renderField = (label, field, value, type = "text") => {
    if (editingField === field) {
      if (type === "textarea") {
        return (
          <div className="space-y-2">
            <p>
              <strong>{label} (Current):</strong> {value || "N/A"}
            </p>
            <div className="flex items-center space-x-2">
              <textarea
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                rows="3"
                className="w-full border p-2 rounded"
              />
              <button
                onClick={() => handleSave(field)}
                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      } else if (type === "select") {
        return (
          <div className="space-y-2">
            <p>
              <strong>{label} (Current):</strong> {value || "N/A"}
            </p>
            <div className="flex items-center space-x-2">
              <select
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="Chief">Chief</option>
              </select>
              <button
                onClick={() => handleSave(field)}
                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-2">
            <p>
              <strong>{label} (Current):</strong>{" "}
              {field === "website_url" && value ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {value}
                </a>
              ) : (
                value || "N/A"
              )}
            </p>
            <div className="flex items-center space-x-2">
              <input
                type={type}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <button
                onClick={() => handleSave(field)}
                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="flex justify-between items-center">
        <p>
          <strong>{label}:</strong>{" "}
          {field === "website_url" && value ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {value}
            </a>
          ) : (
            value || "N/A"
          )}
        </p>
        <button
          onClick={() => handleEdit(field)}
          className="px-2 py-1 bg-cyan-900 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    );
  };
  console.log(profile, "check");
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Employer Profile</h1>
      <div className="space-y-4 text-gray-700">
        {/* Account Details */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold mb-2">Account Information</h2>
          {renderField("Username", "username", profile.data.company_name)}
          {renderField("Email", "email", profile.employerEmail, "email")}
          {/* cannot find the email on fetch */}
        </div>

        {/* Company Details */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold mb-2">Company Information</h2>
          {renderField("Company Name", "company_name", profile.company_name)}
          {renderField(
            "Registered Number",
            "registered_number",
            profile.registered_number
          )}
          {renderField(
            "Contact Phone",
            "contact_phone",
            profile.contact_phone,
            "tel"
          )}
          {renderField("Website", "website_url", profile.website_url, "url")}
          {renderField("Industry", "industry", profile.industry, "select")}
        </div>

        {/* Contact Details */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold mb-2">Address</h2>
          {renderField("Address Line", "address_line", profile.address_line)}
          {renderField("City", "city", profile.city)}
          {renderField("State/Province", "state", profile.state)}
          {renderField("Postal Code", "postal_code", profile.postal_code)}
          {renderField("Country", "country", profile.country)}
        </div>

        {/* Description */}
        <div className="pb-4">
          <h2 className="text-lg font-semibold mb-2">Additional Details</h2>
          {renderField(
            "Description",
            "company_description",
            profile.company_description,
            "textarea"
          )}
        </div>
      </div>
      {updateError && (
        <p className="text-red-500 mt-4">
          {updateError.data?.message || "Update failed."}
        </p>
      )}
    </div>
  );
}

// import React, { useState } from "react";
// import {
//   useGetEmployerProfileQuery,
//   useUpdateEmployerProfileMutation,
// } from "../../redux/api/employerApi";

// const EmployerProfile = () => {
//   const { data: profile, isLoading, error } = useGetEmployerProfileQuery();
//   const [updateEmployerProfile, { isLoading: isUpdating, error: updateError }] =
//     useUpdateEmployerProfileMutation();

//   const [editingField, setEditingField] = useState(null); // Tracks which field is being edited
//   const [formData, setFormData] = useState({});

//   if (isLoading) {
//     return <div className="text-center p-6">Loading profile...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center p-6 text-red-500">
//         Error loading profile: {error.data?.message || "Something went wrong."}
//       </div>
//     );
//   }

//   if (!profile) {
//     return <div className="text-center p-6">No profile data available.</div>;
//   }

//   const handleEdit = (field) => {
//     setEditingField(field);
//     setFormData({ [field]: profile[field] || "" }); // Initialize with current value
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ logo_url: URL.createObjectURL(file) });
//     }
//   };

//   const handleSave = async (field) => {
//     let updatedValue = formData[field];

//     // Handle logo upload if editing logo_url
//     if (field === "logo_url" && updatedValue?.startsWith("blob:")) {
//       const fileInput = document.querySelector("input[type='file']");
//       const file = fileInput.files[0];
//       if (file) {
//         const uploadData = new FormData();
//         uploadData.append("logo", file);

//         const response = await fetch("/api/upload", {
//           method: "POST",
//           body: uploadData,
//           credentials: "include",
//         });
//         const result = await response.json();
//         updatedValue = result.url; // Use uploaded URL
//       }
//     }

//     try {
//       await updateEmployerProfile({ [field]: updatedValue }).unwrap();
//       setEditingField(null);
//       setFormData({});
//       alert(`${field.replace("_", " ")} updated successfully!`);
//     } catch (err) {
//       console.error(`Failed to update ${field}:`, err);
//     }
//   };

//   const handleCancel = () => {
//     setEditingField(null);
//     setFormData({});
//   };

//   const renderField = (label, field, value, type = "text") => {
//     if (editingField === field) {
//       if (type === "textarea") {
//         return (
//           <div className="flex items-center space-x-2">
//             <textarea
//               name={field}
//               value={formData[field] || ""}
//               onChange={handleChange}
//               rows="3"
//               className="w-full border p-2 rounded"
//             />
//             <button
//               onClick={() => handleSave(field)}
//               className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//               disabled={isUpdating}
//             >
//               {isUpdating ? "Saving..." : "Save"}
//             </button>
//             <button
//               onClick={handleCancel}
//               className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         );
//       } else if (type === "file") {
//         return (
//           <div className="flex items-center space-x-2">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full"
//             />
//             {formData[field] && (
//               <img
//                 src={formData[field]}
//                 alt="Logo Preview"
//                 className="mt-2 max-h-20 rounded"
//               />
//             )}
//             <button
//               onClick={() => handleSave(field)}
//               className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//               disabled={isUpdating}
//             >
//               {isUpdating ? "Saving..." : "Save"}
//             </button>
//             <button
//               onClick={handleCancel}
//               className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         );
//       } else if (type === "select") {
//         return (
//           <div className="flex items-center space-x-2">
//             <select
//               name={field}
//               value={formData[field] || ""}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             >
//               <option value="IT">IT</option>
//               <option value="Finance">Finance</option>
//               <option value="Engineering">Engineering</option>
//               <option value="Chief">Chief</option>
//             </select>
//             <button
//               onClick={() => handleSave(field)}
//               className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//               disabled={isUpdating}
//             >
//               {isUpdating ? "Saving..." : "Save"}
//             </button>
//             <button
//               onClick={handleCancel}
//               className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         );
//       } else {
//         return (
//           <div className="flex items-center space-x-2">
//             <input
//               type={type}
//               name={field}
//               value={formData[field] || ""}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//             <button
//               onClick={() => handleSave(field)}
//               className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//               disabled={isUpdating}
//             >
//               {isUpdating ? "Saving..." : "Save"}
//             </button>
//             <button
//               onClick={handleCancel}
//               className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         );
//       }
//     }

//     return (
//       <div className="flex justify-between items-center">
//         <p>
//           <strong>{label}:</strong>{" "}
//           {field === "website_url" && value ? (
//             <a
//               href={value}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 hover:underline"
//             >
//               {value}
//             </a>
//           ) : field === "logo_url" && value ? (
//             <img src={value} alt="Company Logo" className="inline max-h-20" />
//           ) : (
//             value || "N/A"
//           )}
//         </p>
//         <button
//           onClick={() => handleEdit(field)}
//           className="px-2 py-1 bg-cyan-900 text-white rounded hover:bg-blue-700"
//         >
//           Edit
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 shadow-md rounded-lg">
//       <h1 className="text-2xl font-bold mb-6 text-center">Employer Profile</h1>
//       <div className="space-y-4 text-gray-700">
//         {/* Account Details */}
//         <div className="border-b pb-4">
//           <h2 className="text-lg font-semibold mb-2">Account Information</h2>
//           {renderField("Username", "username", profile.username)}
//           {renderField("Email", "email", profile.email, "email")}
//         </div>

//         {/* Company Details */}
//         <div className="border-b pb-4">
//           <h2 className="text-lg font-semibold mb-2">Company Information</h2>
//           {renderField("Company Name", "company_name", profile.company_name)}
//           {renderField(
//             "Registered Number",
//             "registered_number",
//             profile.registered_number
//           )}
//           {renderField(
//             "Contact Phone",
//             "contact_phone",
//             profile.contact_phone,
//             "tel"
//           )}
//           {renderField("Website", "website_url", profile.website_url, "url")}
//           {renderField("Industry", "industry", profile.industry, "select")}
//         </div>

//         {/* Contact Details */}
//         <div className="border-b pb-4">
//           <h2 className="text-lg font-semibold mb-2">Address</h2>
//           {renderField("Address Line", "address_line", profile.address_line)}
//           {renderField("City", "city", profile.city)}
//           {renderField("State/Province", "state", profile.state)}
//           {renderField("Postal Code", "postal_code", profile.postal_code)}
//           {renderField("Country", "country", profile.country)}
//         </div>

//         {/* Description and Logo */}
//         <div className="pb-4">
//           <h2 className="text-lg font-semibold mb-2">Additional Details</h2>
//           {renderField(
//             "Description",
//             "company_description",
//             profile.company_description,
//             "textarea"
//           )}
//           {renderField("Logo", "logo_url", profile.logo_url, "file")}
//         </div>
//       </div>
//       {updateError && (
//         <p className="text-red-500 mt-4">
//           {updateError.data?.message || "Update failed."}
//         </p>
//       )}
//     </div>
//   );
// };

// export default EmployerProfile;

// // check
// // import React, { useEffect, useState } from "react";
// // import {
// //   useGetEmployerProfileQuery,
// //   useUpdateEmployerProfileMutation,
// // } from "../../redux/api/employerApi";

// // export default function EmployerProfile() {
// //   const { data: profile, isLoading, error } = useGetEmployerProfileQuery();
// //   const [updateEmployerProfile, { isLoading: isUpdating, error: updateError }] =
// //     useUpdateEmployerProfileMutation();

// //   const [isEditing, setIsEditing] = useState(false);
// //   const [formData, setFormData] = useState(null);

// //   // Initialize formData when profile is loaded
// //   useEffect(() => {
// //     if (profile && !formData) {
// //       setFormData({
// //         company_name: profile.company_name || "",
// //         registered_number: profile.registered_number || "",
// //         contact_phone: profile.contact_phone || "",
// //         address_line: profile.address_line || "",
// //         city: profile.city || "",
// //         state: profile.state || "",
// //         postal_code: profile.postal_code || "",
// //         country: profile.country || "",
// //         website_url: profile.website_url || "",
// //         industry: profile.industry || "IT",
// //         company_description: profile.company_description || "",
// //         logo_url: profile.logo_url || null,
// //       });
// //     }
// //   }, [profile, formData]);

// //   if (isLoading) {
// //     return <div className="text-center p-6">Loading profile...</div>;
// //   }

// //   if (error) {
// //     return (
// //       <div className="text-center p-6 text-red-500">
// //         Error loading profile: {error.data?.message || "Something went wrong."}
// //       </div>
// //     );
// //   }

// //   if (!profile) {
// //     return <div className="text-center p-6">No profile data available.</div>;
// //   }

// //   const handleEdit = () => setIsEditing(true);

// //   const handleCancel = () => {
// //     setIsEditing(false);
// //     setFormData({
// //       company_name: profile.company_name || "",
// //       registered_number: profile.registered_number || "",
// //       contact_phone: profile.contact_phone || "",
// //       address_line: profile.address_line || "",
// //       city: profile.city || "",
// //       state: profile.state || "",
// //       postal_code: profile.postal_code || "",
// //       country: profile.country || "",
// //       website_url: profile.website_url || "",
// //       industry: profile.industry || "IT",
// //       company_description: profile.company_description || "",
// //       logo_url: profile.logo_url || null,
// //     });
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       await updateEmployerProfile(formData).unwrap();
// //       setIsEditing(false);
// //       alert("Profile updated successfully!");
// //     } catch (err) {
// //       console.error("Update failed:", err);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setFormData({ ...formData, logo_url: URL.createObjectURL(file) });
// //     }
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto p-6  shadow-md rounded-lg">
// //       <h1 className="text-2xl font-bold mb-6 text-center">Employer Profile</h1>

// //       {isEditing ? (
// //         <div className="space-y-4">
// //           {/* Editable Form */}
// //           <div>
// //             <label className="block font-semibold">Company Name</label>
// //             <input
// //               type="text"
// //               name="company_name"
// //               value={formData.company_name}
// //               onChange={handleChange}
// //               className="w-full border p-2 rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block font-semibold">Registered Number</label>
// //             <input
// //               type="text"
// //               name="registered_number"
// //               value={formData.registered_number}
// //               onChange={handleChange}
// //               className="w-full border p-2 rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block font-semibold">Contact Phone</label>
// //             <input
// //               type="tel"
// //               name="contact_phone"
// //               value={formData.contact_phone}
// //               onChange={handleChange}
// //               className="w-full border p-2 rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block font-semibold">Website</label>
// //             <input
// //               type="url"
// //               name="website_url"
// //               value={formData.website_url}
// //               onChange={handleChange}
// //               className="w-full border p-2 rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block font-semibold">Industry</label>
// //             <select
// //               name="industry"
// //               value={formData.industry}
// //               onChange={handleChange}
// //               className="w-full border p-2 rounded"
// //             >
// //               <option value="IT">IT</option>
// //               <option value="Finance">Finance</option>
// //               <option value="Engineering">Engineering</option>
// //               <option value="Chief">Chief</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block font-semibold">Address Line</label>
// //             <input
// //               type="text"
// //               name="address_line"
// //               value={formData.address_line}
// //               onChange={handleChange}
// //               className="w-full border p-2 rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block font-semibold">City</label>
// //             <input
// //               type="text"
// //               name="city"
// //               value={formData.city}
// //               onChange={handleChange}
// //               className="w-full border p-2 rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block font-semibold">State/Province</label>
// //             <input
// //               type="text"
// //               name="state"
// //               value={formData.state}
// //               onChange={handleChange}
// //               className="w-full border p-2 rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block font-semibold">Postal Code</label>
// //             <input
// //               type="text"
// //               name="postal_code"
// //               value={formData.postal_code}
// //               onChange={handleChange}
// //               className="w-full border p-2 rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block font-semibold">Country</label>
// //             <input
// //               type="text"
// //               name="country"
// //               value={formData.country}
// //               onChange={handleChange}
// //               className="w-full border p-2 rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block font-semibold">Description</label>
// //             <textarea
// //               name="company_description"
// //               value={formData.company_description}
// //               onChange={handleChange}
// //               rows="5"
// //               className="w-full border p-2 rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block font-semibold">Logo</label>
// //             <input
// //               type="file"
// //               accept="image/*"
// //               onChange={handleFileChange}
// //               className="w-full"
// //             />
// //             {formData.logo_url && (
// //               <img
// //                 src={formData.logo_url}
// //                 alt="Logo Preview"
// //                 className="mt-2 max-h-40 rounded"
// //               />
// //             )}
// //           </div>

// //           {updateError && (
// //             <p className="text-red-500">
// //               {updateError.data?.message || "Update failed."}
// //             </p>
// //           )}

// //           <div className="flex justify-between mt-4">
// //             <button
// //               onClick={handleCancel}
// //               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               onClick={handleSubmit}
// //               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
// //               disabled={isUpdating}
// //             >
// //               {isUpdating ? "Saving..." : "Save Changes"}
// //             </button>
// //           </div>
// //         </div>
// //       ) : (
// //         <div className="space-y-4 text-gray-700">
// //           {/* Display Mode */}
// //           <div className="border-b pb-4">
// //             <h2 className="text-lg font-semibold mb-2">Account Information</h2>
// //             <p>
// //               <strong>Username:</strong> {profile.username || "N/A"}
// //             </p>
// //             <p>
// //               <strong>Email:</strong> {profile.email || "N/A"}
// //             </p>
// //           </div>

// //           <div className="border-b pb-4">
// //             <h2 className="text-lg font-semibold mb-2">Company Information</h2>
// //             <p>
// //               <strong>Company Name:</strong> {profile.company_name || "N/A"}
// //             </p>
// //             <p>
// //               <strong>Registered Number:</strong>{" "}
// //               {profile.registered_number || "N/A"}
// //             </p>
// //             <p>
// //               <strong>Contact Phone:</strong> {profile.contact_phone || "N/A"}
// //             </p>
// //             <p>
// //               <strong>Website:</strong>{" "}
// //               {profile.website_url ? (
// //                 <a
// //                   href={profile.website_url}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="text-blue-500 hover:underline"
// //                 >
// //                   {profile.website_url}
// //                 </a>
// //               ) : (
// //                 "N/A"
// //               )}
// //             </p>
// //             <p>
// //               <strong>Industry:</strong> {profile.industry || "N/A"}
// //             </p>
// //           </div>

// //           <div className="border-b pb-4">
// //             <h2 className="text-lg font-semibold mb-2">Address</h2>
// //             <p>
// //               <strong>Full Address:</strong>{" "}
// //               {`${profile.address_line || ""}${profile.address_line && ", "}${
// //                 profile.city || ""
// //               }${profile.city && ", "}${profile.state || ""}${
// //                 profile.state && ", "
// //               }${profile.postal_code || ""}${profile.postal_code && ", "}${
// //                 profile.country || ""
// //               }` || "N/A"}
// //             </p>
// //           </div>

// //           <div className="pb-4">
// //             <h2 className="text-lg font-semibold mb-2">Additional Details</h2>
// //             <p>
// //               <strong>Description:</strong>{" "}
// //               {profile.company_description || "No description provided."}
// //             </p>
// //             <div className="mt-2">
// //               <strong>Logo:</strong>
// //               {profile.logo_url ? (
// //                 <img
// //                   src={profile.logo_url}
// //                   alt="Company Logo"
// //                   className="mt-2 max-h-40 rounded"
// //                 />
// //               ) : (
// //                 <span className="ml-2">No logo uploaded.</span>
// //               )}
// //             </div>
// //           </div>

// //           <div className="mt-6 text-center">
// //             <button
// //               onClick={handleEdit}
// //               className="px-4 py-2 bg-cyan-900 text-white rounded hover:bg-blue-700"
// //             >
// //               Edit Profile
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
