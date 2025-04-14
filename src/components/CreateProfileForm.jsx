import { useState } from "react";
import { useCreateProfileMutation } from "../redux/api/userApi";

const CreateProfileForm = () => {
  const [createProfile, { isLoading, isSuccess, error }] =
    useCreateProfileMutation();

  const [formData, setFormData] = useState({});
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formData = {
    //   first_name: "John",
    //   last_name: "Doe",
    //   phone: "12345678",
    //   gender: "Male",
    //   date_of_birth: "1990-01-01",
    //   location: "Singapore",
    //   bio: "I'm a motivated job seeker!",
    // };

    try {
      await createProfile(formData).unwrap();
      alert("Profile created successfully!");
    } catch (err) {
      console.error("Failed to create profile:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 items-center">
      {/* your input fields here */}
      <input
        type="text"
        placeholder="Enter First Name"
        className="bg-sky-400 p-2 m-1"
      />
      <input
        type="text"
        placeholder="Enter Here"
        className="bg-sky-400 p-2 m-1"
      />
      <input
        type="tel"
        placeholder="Enter Here"
        className="bg-sky-400 p-2 m-1"
      />
      <input type="date" />

      <select className="bg-sky-400 p-2 m-1">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="text"
        placeholder="Enter Location "
        className="bg-sky-400 p-2"
      />
      <textarea
        type="text"
        placeholder="Enter Bios "
        className="bg-sky-400 p-2"
      />

      <button type="submit" disabled={isLoading} className="bg-amber-200 p-2">
        {isLoading ? "Creating..." : "Create Profile"}
      </button>
    </form>
  );
};

export default CreateProfileForm;
