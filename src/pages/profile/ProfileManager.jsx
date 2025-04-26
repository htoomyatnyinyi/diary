import React, { useState } from "react";
import {
  useCreateProfileMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} from "../../redux/api/userApi";

import { toast } from "react-toastify"; // For user notifications

const ProfileManager = () => {
  const { data: profileResponse, isLoading, error } = useGetProfileQuery();
  const [createProfile, { isLoading: isCreating }] = useCreateProfileMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [deleteProfile, { isLoading: isDeleting }] = useDeleteProfileMutation();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    location: "",
    bio: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const response = await createProfile(formData).unwrap();
      toast.success(response.message, { toastId: response.meta.requestId });
    } catch (err) {
      console.error("Create Profile Error:", err);
      toast.error(err.data?.message || "Failed to create profile", {
        toastId: err.data?.meta?.requestId,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await updateProfile(formData).unwrap();
      toast.success(response.message, { toastId: response.meta.requestId });
    } catch (err) {
      console.error("Update Profile Error:", err);
      toast.error(err.data?.message || "Failed to update profile", {
        toastId: err.data?.meta?.requestId,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteProfile().unwrap();
      toast.success(response.message, { toastId: response.meta.requestId });
    } catch (err) {
      console.error("Delete Profile Error:", err);
      toast.error(err.data?.message || "Failed to delete profile", {
        toastId: err.data?.meta?.requestId,
      });
    }
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (error) {
    console.error("Get Profile Error:", error);
    return (
      <div>
        Error: {error.data?.message || "Failed to load profile"} (Request ID:{" "}
        {error.data?.meta?.requestId})
      </div>
    );
  }

  return (
    <div>
      <h2>Manage Profile</h2>
      {profileResponse?.data && (
        <div>
          <p>
            Current Profile: {profileResponse.data.first_name}{" "}
            {profileResponse.data.last_name}
          </p>
        </div>
      )}
      <form>
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          placeholder="First Name"
        />
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          placeholder="Last Name"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Phone"
        />
        {/* Add other fields */}
        <button type="button" onClick={handleCreate} disabled={isCreating}>
          Create Profile
        </button>
        <button type="button" onClick={handleUpdate} disabled={isUpdating}>
          Update Profile
        </button>
        <button type="button" onClick={handleDelete} disabled={isDeleting}>
          Delete Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileManager;
