import React, { useState } from "react";
import defaultCover from "../../assets/utils/A.png";
import defaultProfile from "../../assets/utils/B.png";

import {
  useGetEmployerProfileQuery,
  useUpdateEmployerProfileMutation,
} from "../../redux/api/employerApi";
import CreateEmployerProfile from "./CreateEmployerProfile";

const EmployerProfile = () => {
  const { data: profile, isLoading, error } = useGetEmployerProfileQuery();

  if (isLoading)
    return <div className="text-center p-6">Loading profile...</div>;

  // if (error)
  //   return (
  //     <div className="text-center p-6 text-red-500">
  //       Error: {error.data?.message || "Something went wrong."}
  //       <button className="bg-green-500 p-2" onClick={() => console.log("Hi")}>
  //         Link to Create Employer
  //       </button>
  //     </div>
  //   );

  if (!profile)
    return (
      <div className="text-center p-6">
        <CreateEmployerProfile />
      </div>
    );

  return (
    <div>
      {/* {!profile ? <p>Thers is no profile</p> : <p>There is a profile</p>} */}
      <EmployerProfileWall
        employerName={profile.data.company_name}
        description={profile.data.company_description}
        coverImageUrl={profile.data.cover_image_url || defaultCover}
        profileImageUrl={profile.data.profile_image_url || defaultProfile}
      />

      <ProfileInfo />
    </div>
  );
};

export default EmployerProfile;

const EmployerProfileWall = ({
  employerName,
  description,
  coverImageUrl = defaultCover, // Use provided URL or default
  profileImageUrl = defaultProfile, // Use provided URL or default
  // location,
  // industry,
}) => {
  return (
    // Outer container for shadow, rounded corners, and max width
    <div className=" mx-auto  shadow-lg rounded-lg overflow-hidden my-4">
      {/* --- Cover Image Section --- */}
      <div
        className="h-96 bg-cover bg-center " // Added placeholder bg color
        style={{ backgroundImage: `url(${coverImageUrl})` }}
        role="img" // Accessibility
        aria-label={`${employerName} cover image`}
      >
        <p className="text-sm ">Develop By Htoo Myat Nyi Nyi</p>
        {/* Optionally add elements over the cover image here */}
      </div>

      {/* --- Profile Content Area --- */}
      <div className="relative p-6 ">
        {/* Relative positioning context for the profile image */}
        {/* --- Profile Picture/Logo --- */}
        {/* Positioned to overlap the bottom of the cover image */}
        <div className="absolute left-16 mt-16 sm:-mt-20">
          {/* Adjust negative margin as needed */}
          <img
            src={profileImageUrl}
            alt={`${employerName} profile`}
            // Styling for the profile image: size, circle, border
            className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white  shadow-md" // Added placeholder bg and shadow
          />
        </div>
        {/* --- Text Content --- */}
        {/* Add padding/margin to the left to clear the profile picture */}
        <div className="pt-8 sm:pt-4 pl-0 sm:pl-40 min-h-20 ">
          {/* Adjust left padding (sm:pl-40) based on profile image size + spacing */}
          <h1 className="text-2xl sm:text-3xl font-bold  mb-1">
            {employerName}
          </h1>
          {/* Optional: Add more details like location or industry */}
          {/* {location && <p className="text-sm text-gray-500 mb-1">{location}</p>} */}
          {/* {industry && <p className="text-sm text-gray-500 mb-3">{industry}</p>} */}
          <p className="text-sm sm:text-base mt-2">{description}</p>
        </div>
        {/* --- Optional: Action Buttons or Links --- */}
        {/* Example: Buttons positioned below the main text */}
        <div className="mt-4 pl-0 sm:pl-40 flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
            View Jobs
          </button>
          <button className="px-4 py-2  text-gray-800 text-sm rounded-md hover:bg-gray-300">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileInfo = () => {
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useGetEmployerProfileQuery();

  const [updateEmployerProfile, { isLoading: isUpdating, error: updateError }] =
    useUpdateEmployerProfileMutation();

  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});

  if (isLoading)
    return <div className="text-center p-6">Loading profile...</div>;

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        Error: {error.data?.message || "Something went wrong."}
      </div>
    );
  }

  if (!profile) return <div className="text-center p-6">No profile found.</div>;

  const handleEdit = (field) => {
    setEditingField(field);
    setFormData({ [field]: profile.data[field] || "" });
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
      refetch();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData({});
  };

  const renderField = (label, field, value, type = "text") => {
    const isEditing = editingField === field;
    const inputClass = "w-full border rounded px-3 py-2";

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full">
          <label className="font-medium">{label}</label>
          {isEditing ? (
            <>
              {type === "textarea" ? (
                <textarea
                  rows={3}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              ) : type === "select" ? (
                <select
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">-- Select --</option>
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Chief">Chief</option>
                </select>
              ) : (
                <input
                  type={type}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              )}
            </>
          ) : (
            <p className="mt-1 text-green-500">
              {field === "website_url" && value ? (
                <a
                  href={value}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {value}
                </a>
              ) : (
                value || "N/A"
              )}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => handleSave(field)}
                className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isUpdating}
              >
                Save
                {/* <CheckIcon className="h-5 w-5" /> */}
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
                {/* <XIcon className="h-5 w-5" /> */}
              </button>
            </>
          ) : (
            <button
              onClick={() => handleEdit(field)}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
              {/* <PencilIcon className="h-5 w-5" /> */}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className=" mx-auto px-6 py-10  shadow-lg rounded-lg">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">Employer Profile</h1> */}

      <div className="divide-y">
        {/* Account Info
        <section>
          <h2 className="text-xl font-semibold  mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField(
              "Business Name",
              "username",
              profile.data.company_name
            )}
          </div>
        </section> */}
        {/* Company Info */}
        <section className="pt-6">
          <h2 className="text-xl font-semibold  mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField(
              "Company Name",
              "company_name",
              profile.data.company_name
            )}
            {renderField(
              "Registered Number",
              "registered_number",
              profile.data.registered_number
            )}
            {renderField(
              "Contact Phone",
              "contact_phone",
              profile.data.contact_phone,
              "tel"
            )}
            {renderField(
              "Website",
              "website_url",
              profile.data.website_url,
              "url"
            )}
            {renderField(
              "Industry",
              "industry",
              profile.data.industry,
              "select"
            )}
          </div>
        </section>
        {/* Address */}
        <section className="pt-6">
          <h2 className="text-xl font-semibold  mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("Address", "address_line", profile.data.address_line)}
            {renderField("City", "city", profile.data.city)}
            {renderField("State", "state", profile.data.state)}
            {renderField(
              "Postal Code",
              "postal_code",
              profile.data.postal_code
            )}
            {renderField("Country", "country", profile.data.country)}
          </div>
        </section>
        {/* Additional Info */}
        <section className="pt-6">
          <h2 className="text-xl font-semibold  mb-4">
            Additional Information
          </h2>
          <div>
            {renderField(
              "Description",
              "company_description",
              profile.data.company_description,
              "textarea"
            )}
          </div>
        </section>
      </div>

      {updateError && (
        <p className="text-red-500 mt-6 text-center">
          {updateError.data?.message || "Failed to update profile."}
        </p>
      )}
    </div>
  );
};

// // // Both Code is working but different design
// // import React, { useState } from "react";
// // import {
// //   useGetEmployerProfileQuery,
// //   useUpdateEmployerProfileMutation,
// // } from "../../redux/api/employerApi";
// // import CreateEmployerProfile from "./CreateEmployerProfile";

// // export default function EmployerProfile() {
// //   const {
// //     data: profile,
// //     isLoading,
// //     error,
// //     refetch,
// //   } = useGetEmployerProfileQuery();

// //   const [updateEmployerProfile, { isLoading: isUpdating, error: updateError }] =
// //     useUpdateEmployerProfileMutation();

// //   const [editingField, setEditingField] = useState(null); // Tracks which field is being edited

// //   const [formData, setFormData] = useState({});

// //   if (isLoading) {
// //     return <div className="text-center p-6">Loading profile...</div>;
// //   }

// //   if (error) {
// //     return (
// //       <div className="text-center p-6 text-red-500">
// //         Error loading profile: {error.data?.message || "Something went wrong."}
// //         <p className="text-cyan-900 dark:text-white">
// //           <CreateEmployerProfile />
// //         </p>
// //       </div>
// //     );
// //   }

// //   if (!profile) {
// //     return <div className="text-center p-6">No profile data available.</div>;
// //   }

// //   const handleEdit = (field) => {
// //     setEditingField(field);
// //     setFormData({ [field]: profile[field] || "" }); // Initialize with current value
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({ [name]: value });
// //   };

// //   const handleSave = async (field) => {
// //     try {
// //       await updateEmployerProfile({ [field]: formData[field] }).unwrap();
// //       setEditingField(null);
// //       setFormData({});
// //       refetch();
// //       alert(`${field.replace("_", " ")} updated successfully!`);
// //     } catch (err) {
// //       console.error(`Failed to update ${field}:`, err);
// //     }
// //   };

// //   const handleCancel = () => {
// //     setEditingField(null);
// //     setFormData({});
// //   };

// //   const renderField = (label, field, value, type = "text") => {
// //     if (editingField === field) {
// //       if (type === "textarea") {
// //         return (
// //           <div className="space-y-2">
// //             <p>
// //               <strong>{label} (Current):</strong> {value || "N/A"}
// //             </p>
// //             <div className="flex items-center space-x-2">
// //               <textarea
// //                 name={field}
// //                 value={formData[field] || ""}
// //                 onChange={handleChange}
// //                 rows="3"
// //                 className="w-full border p-2 rounded"
// //               />
// //               <button
// //                 onClick={() => handleSave(field)}
// //                 className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
// //                 disabled={isUpdating}
// //               >
// //                 {isUpdating ? "Saving..." : "Save"}
// //               </button>
// //               <button
// //                 onClick={handleCancel}
// //                 className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         );
// //       } else if (type === "select") {
// //         return (
// //           <div className="space-y-2">
// //             <p>
// //               <strong>{label} (Current):</strong> {value || "N/A"}
// //             </p>
// //             <div className="flex items-center space-x-2">
// //               <select
// //                 name={field}
// //                 value={formData[field] || ""}
// //                 onChange={handleChange}
// //                 className="w-full border p-2 rounded"
// //               >
// //                 <option value="IT">IT</option>
// //                 <option value="Finance">Finance</option>
// //                 <option value="Engineering">Engineering</option>
// //                 <option value="Chief">Chief</option>
// //               </select>
// //               <button
// //                 onClick={() => handleSave(field)}
// //                 className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
// //                 disabled={isUpdating}
// //               >
// //                 {isUpdating ? "Saving..." : "Save"}
// //               </button>
// //               <button
// //                 onClick={handleCancel}
// //                 className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         );
// //       } else {
// //         return (
// //           <div className="space-y-2">
// //             <p>
// //               <strong>{label} (Current):</strong>{" "}
// //               {field === "website_url" && value ? (
// //                 <a
// //                   href={value}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="text-blue-500 hover:underline"
// //                 >
// //                   {value}
// //                 </a>
// //               ) : (
// //                 value || "N/A"
// //               )}
// //             </p>
// //             <div className="flex items-center space-x-2">
// //               <input
// //                 type={type}
// //                 name={field}
// //                 value={formData[field] || ""}
// //                 onChange={handleChange}
// //                 className="w-full border p-2 rounded"
// //               />
// //               <button
// //                 onClick={() => handleSave(field)}
// //                 className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
// //                 disabled={isUpdating}
// //               >
// //                 {isUpdating ? "Saving..." : "Save"}
// //               </button>
// //               <button
// //                 onClick={handleCancel}
// //                 className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         );
// //       }
// //     }

// //     return (
// //       <div className="flex justify-between items-center">
// //         <p>
// //           <strong>{label}:</strong>
// //           {field === "website_url" && value ? (
// //             <a
// //               href={value}
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="text-blue-500 hover:underline"
// //             >
// //               {value}
// //             </a>
// //           ) : (
// //             value || "N/A"
// //           )}
// //         </p>
// //         <button
// //           onClick={() => handleEdit(field)}
// //           className="px-2 py-1 bg-cyan-900 text-white rounded hover:bg-blue-700"
// //         >
// //           Edit
// //         </button>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto p-6 shadow-md rounded-lg">
// //       <h1 className="text-2xl font-bold mb-6 text-center">Employer Profile</h1>
// //       <div className="space-y-4 ">
// //         {/* Account Details */}
// //         <div className="border-b pb-4">
// //           <h2 className="text-lg font-semibold mb-2">Account Information</h2>
// //           {renderField("Username", "username", profile.data.company_name)}
// //           {/* {renderField("Email", "email", profile.data.employerEmail, "email")} */}
// //           {/* cannot find the email on fetch */}
// //         </div>

// //         {/* Company Details */}
// //         <div className="border-b pb-4">
// //           <h2 className="text-lg font-semibold mb-2">Company Information</h2>
// //           {renderField(
// //             "Company Name",
// //             "company_name",
// //             profile.data.company_name
// //           )}
// //           {renderField(
// //             "Registered Number",
// //             "registered_number",
// //             profile.data.registered_number
// //           )}
// //           {renderField(
// //             "Contact Phone",
// //             "contact_phone",
// //             profile.data.contact_phone,
// //             "tel"
// //           )}
// //           {renderField(
// //             "Website",
// //             "website_url",
// //             profile.data.website_url,
// //             "url"
// //           )}
// //           {renderField("Industry", "industry", profile.data.industry, "select")}
// //         </div>

// //         {/* Contact Details */}
// //         <div className="border-b pb-4">
// //           <h2 className="text-lg font-semibold mb-2">Address</h2>
// //           {renderField(
// //             "Address Line",
// //             "address_line",
// //             profile.data.address_line
// //           )}
// //           {renderField("City", "city", profile.data.city)}
// //           {renderField("State/Province", "state", profile.data.state)}
// //           {renderField("Postal Code", "postal_code", profile.data.postal_code)}
// //           {renderField("Country", "country", profile.data.country)}
// //         </div>

// //         {/* Description */}
// //         <div className="pb-4">
// //           <h2 className="text-lg font-semibold mb-2">Additional Details</h2>
// //           {renderField(
// //             "Description",
// //             "company_description",
// //             profile.data.company_description,
// //             "textarea"
// //           )}
// //         </div>
// //       </div>
// //       {updateError && (
// //         <p className="text-red-500 mt-4">
// //           {updateError.data?.message || "Update failed."}
// //         </p>
// //       )}
// //     </div>
// //   );
// // }
