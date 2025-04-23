import React, { useState } from "react";
import {
  useGetProfileQuery,
  useGetResumeQuery,
  useGetSavedJobsQuery,
  useGetApplicationsQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
} from "../../redux/api/userApi";
import Resume from "./Resume";
import defaultCover from "../../assets/utils/A.png";
import defaultProfile from "../../assets/utils/B.png";
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
      <UserProfileWall
        userName={profile?.data.first_name}
        userBios={profile?.data.bio}
      />
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
      <Resume />
    </div>
  );
};

export default UserProfile;

const UserProfileWall = ({
  userName,
  userBios,
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
        className="h-96 bg-cover bg-center bg-gray-300" // Added placeholder bg color
        style={{ backgroundImage: `url(${coverImageUrl})` }}
        role="img" // Accessibility
        aria-label={`${userName} cover image`}
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
            alt={`${userName} profile`}
            // Styling for the profile image: size, circle, border
            className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-gray-200 shadow-md" // Added placeholder bg and shadow
          />
        </div>
        {/* --- Text Content --- */}
        {/* Add padding/margin to the left to clear the profile picture */}
        <div className="pt-8 sm:pt-4 pl-0 sm:pl-40 min-h-20 ">
          {/* Adjust left padding (sm:pl-40) based on profile image size + spacing */}
          <h1 className="text-2xl sm:text-3xl font-bold  mb-1">{userName}</h1>
          {/* Optional: Add more details like location or industry */}
          {/* {location && <p className="text-sm text-gray-500 mb-1">{location}</p>} */}
          {/* {industry && <p className="text-sm text-gray-500 mb-3">{industry}</p>} */}
          <p className="text-sm sm:text-base mt-2">{userBios}</p>
        </div>
        {/* --- Optional: Action Buttons or Links --- */}
        {/* Example: Buttons positioned below the main text */}
        <div className="mt-4 pl-0 sm:pl-40 flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
            View Jobs
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};
