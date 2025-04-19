import React, { useState } from "react";
import {
  useGetProfileQuery,
  useGetResumeQuery,
  useGetSavedJobsQuery,
  useGetApplicationsQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
} from "../../redux/api/userApi";

const UserProfile = () => {
  const [formData, setFormData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    location: "",
    bio: "",
  });

  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch,
  } = useGetProfileQuery(null);

  const [updateProfile, { isLoading: isUpdating, error: updateError }] =
    useUpdateProfileMutation();

  const [createProfile, { isLoading: isCreating, error: createError }] =
    useCreateProfileMutation();

  const handleCreateChange = (e) => {
    const { name, value } = e.target;

    setCreateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProfile(createFormData).unwrap();
      setCreateFormData({
        first_name: "",
        last_name: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        location: "",
        bio: "",
      });
      refetch();
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Profile</h1>
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={createFormData.first_name}
              onChange={handleCreateChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={createFormData.last_name}
              onChange={handleCreateChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={createFormData.phone}
              onChange={handleCreateChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={createFormData.gender}
              onChange={handleCreateChange}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="date_of_birth"
              className="block text-sm font-medium"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={createFormData.date_of_birth}
              onChange={handleCreateChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={createFormData.location}
              onChange={handleCreateChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={createFormData.bio}
              onChange={handleCreateChange}
              className="mt-1 p-2 w-full border rounded-md"
              rows="4"
            />
          </div>

          {createError && (
            <p className="text-red-500">
              {createError.data?.message || "Failed to create profile"}
            </p>
          )}

          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isCreating ? "Creating..." : "Create Profile"}
          </button>
        </form>
      </div>
    );
  }

  if (isProfileLoading) return <p>Loading Profile...</p>;

  const handleEdit = (field) => {
    setEditingField(field);
    setFormData({ [field]: profile[field] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleSave = async (field) => {
    try {
      const payload = { [field]: formData[field] };
      await updateProfile(payload).unwrap();
      setEditingField(null);
      setFormData({});
      refetch();
    } catch (error) {
      console.error(`Failed to update ${field}`, error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData({});
  };

  const renderField = (label, field, value, type = "text") => {
    if (editingField === field) {
      return (
        <div className="border border-gray-200 p-4 m-4 rounded-md">
          <p className="p-2 m-1">
            <strong className="bg-green-100 p-2 rounded">
              {label} (Current):
            </strong>{" "}
            {value}
          </p>
          <div className="flex items-center space-x-2">
            <input
              type={type}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              className="p-2 border rounded-md flex-1"
            />
            <button
              onClick={() => handleSave(field)}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 m-4">
        <p className="p-2">
          <strong>{label}: </strong>
          <span>{value}</span>
        </p>
        <button
          onClick={() => handleEdit(field)}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Edit
        </button>
      </div>
    );
  };

  return (
    <div>
      <div>
        <div className="flex flex-nowrap justify-around items-center">
          <li className="block p-8 m-1 shadow-2xs hover:bg-white bg-slate-500"></li>
          <li className="block p-8 m-1 shadow-2xs hover:bg-white bg-slate-500 "></li>
          <li className="block p-8 m-1 shadow-2xs hover:bg-white bg-slate-500 "></li>
          <li className="block p-8 m-1 shadow-2xs hover:bg-white bg-slate-500 "></li>
        </div>
      </div>
      <div className="p-4 m-1 backdrop-blur-3xl shadow-2xl">
        <div className="flex justify-evenly flex-wrap">
          <div>
            {renderField(
              "First Name",
              "first_name",
              profile?.data.first_name || "N/A"
            )}
            {renderField(
              "Last Name",
              "last_name",
              profile?.data.last_name || "N/A"
            )}
            {renderField("Phone", "phone", profile?.data.phone || "N/A")}
          </div>
          <div>
            {renderField("Gender", "gender", profile?.data.gender || "N/A")}
            {renderField(
              "Date of Birth",
              "date_of_birth",
              profile?.data.date_of_birth || "N/A"
            )}
            {renderField(
              "Location",
              "location",
              profile?.data.location || "N/A"
            )}
            {renderField("Bio", "bio", profile?.data.bio || "N/A")}
          </div>
        </div>
        <div>
          {updateError && (
            <p className="text-red-500 mt-4">
              {updateError.data?.message || "Update failed."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

// this version is not fullfilled i bore
// import React, { useState } from "react";
// import {
//   useGetProfileQuery,
//   useGetResumeQuery,
//   useGetSavedJobsQuery,
//   useGetApplicationsQuery,
//   useCreateProfileMutation,
//   useUpdateProfileMutation,
// } from "../../redux/api/userApi";

// const UserProfile = () => {
//   const [formData, setFormData] = useState({});
//   const [editingField, setEditingField] = useState(null);

//   const [profileData, setProfileData] = useState({
//     first_name: "",
//     last_name: "",
//     phone: "",
//     gender: "",
//     date_of_birth: "",
//     location: "",
//     bio: "",
//   });

//   const {
//     data: profile,
//     isLoading: isProfileLoading,
//     refetch,
//   } = useGetProfileQuery(null);

//   const [updateProfile, { isLoading: isUpdating, error: updateError }] =
//     useUpdateProfileMutation();

//   const [createProfile, { isLoading: isCreating, error: createError }] =
//     useCreateProfileMutation();

//   if (!profile)
//     return (
//       <div>
//         <h1>Create New Profile</h1>

//         <input type="text" name="" id="" />
//         <input type="text" name="" id="" />
//         <input type="tel" name="" id="" />
//         <select>
//           <option value="male">male</option>
//           <option value="female">female</option>
//           <option value="other">other</option>
//         </select>

//         <input type="date" name="" id="" />
//         <input type="text" name="" id="" />
//         <textarea name="bios" id=""></textarea>
//       </div>
//     );

//   if (isProfileLoading) return <p>GetJob Loading..</p>;

//   const handleEdit = (field) => {
//     console.log(field);
//     setEditingField(field);
//     setFormData({ [field]: profile[field] });
//     // console.log(editingField, " for edit");
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // console.log(e.target, " at handlechange");
//     setFormData({ [name]: value });
//   };

//   // const handleSave = async (field) => {
//   //   try {
//   //     await updateProfile({
//   //       [field]: formData[field],
//   //     }).unwrap();
//   //     setEditingField(null);
//   //     setFormData({});
//   //     // refetch();
//   //   } catch (error) {
//   //     console.error(`Field to update ${field}`, error);
//   //   }
//   // };

//   const handleSave = async (field) => {
//     try {
//       // Create the payload, ensuring all required fields are present
//       // Option A: Send only the updated field (if backend supports PATCH)
//       const payload = { [field]: formData[field] };

//       // Option B: Send merged data (if backend requires more fields)
//       // const payload = {
//       //   ...profile.data, // Include existing data
//       //   [field]: formData[field] // Overwrite with the edited value
//       // };
//       // Ensure payload includes *all* non-nullable fields required by backend/DB

//       await updateProfile(payload).unwrap(); // Send the appropriate payload
//       setEditingField(null);
//       setFormData({});
//       refetch();
//     } catch (error) {
//       console.error(`Failed to update ${field}`, error);
//       // Display error to the user via updateError state
//     }
//   };

//   const handleCancel = () => {
//     setEditingField(null);
//     setFormData({});
//   };

//   // renderField for Edit
//   const renderField = (label, field, value, type = "text") => {
//     // console.log(label, field, value, type, "");
//     // console.log(editingField === field);
//     if (editingField === field) {
//       console.log(editingField === field, "at render ", field);
//       return (
//         <div className="border border-white dark:border-cyan-900 p-4 m-4 ">
//           <p className="p-2 m-1">
//             <strong className="bg-green-600 p-2">{label} (Current) :</strong>
//             {value}
//           </p>
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               name={field}
//               value={formData[field] || ""}
//               onChange={handleChange}
//               className="p-2 bg-red-500"
//             />
//             <button
//               onClick={() => handleSave(field)}
//               className="p-2 bg-amber-400 m-1 hover:bg-green-500"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleCancel}
//               className="p-2 bg-slate-300 m-1 hover:bg-green-500"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="flex-1 m-4">
//         <p className="p-2">
//           <strong className=" ">{label} _: </strong>
//           <strong className=" ">{value}</strong>
//         </p>
//         <button
//           onClick={() => handleEdit(field)}
//           className="bg-amber-600 p-2 hover:bg-blue-900"
//         >
//           Edit
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="p-4 m-2">
//       <div className="flex justify-evenly">
//         <div>
//           {renderField(
//             "FirstName",
//             "first_name",
//             profile?.data.first_name || "N/A"
//           )}
//           {renderField(
//             "LastName",
//             "last_name",
//             profile?.data.last_name || "N/A"
//           )}
//           {renderField("Phone", "phone", profile?.data.phone || "N/A")}
//         </div>
//         <div>
//           {renderField("Gender", "gender", profile?.data.gender || "N/A")}
//           {renderField(
//             "DOB",
//             "date_of_birth",
//             profile?.data.date_of_birth || "N/A"
//           )}
//           {renderField("Location", "location", profile?.data.location || "N/A")}
//           {renderField("Bios", "bio", profile?.data.bio || "N/A")}
//         </div>
//       </div>
//       <div>
//         {updateError && (
//           <p className="text-red-500 mt-4">
//             {updateError.data?.message || "Update failed."}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
