import { useCreateProfileMutation } from "../redux/api/userApi";

const CreateProfileForm = () => {
  const [createProfile, { isLoading, isSuccess, error }] =
    useCreateProfileMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      first_name: "John",
      last_name: "Doe",
      phone: "12345678",
      gender: "Male",
      date_of_birth: "1990-01-01",
      location: "Singapore",
      bio: "I'm a motivated job seeker!",
    };

    try {
      await createProfile(formData).unwrap();
      alert("Profile created successfully!");
    } catch (err) {
      console.error("Failed to create profile:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* your input fields here */}
      <button type="submit" disabled={isLoading} className="bg-amber-200 p-2">
        {isLoading ? "Creating..." : "Create Profile"}
      </button>
    </form>
  );
};

export default CreateProfileForm;
