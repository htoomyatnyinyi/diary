import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStep, updateFormData } from "../../redux/slice/registerationSlice";
import {
  useRegisterCompanyMutation,
  useCreateEmployerProfileMutation,
  useGetEmployerProfileQuery,
} from "../../redux/api/registerApi";

const steps = ["Account", "Company", "Contact", "Description", "Review"];

export default function Register() {
  const dispatch = useDispatch();
  const { step, formData } = useSelector((state) => state.reducer.registration);

  const { data } = useGetEmployerProfileQuery();

  console.log(data, "fetch");

  const [registerCompany, { isLoading: isRegistering }] =
    useRegisterCompanyMutation();

  const [createEmployerProfile, { isLoading: isCreatingProfile }] =
    useCreateEmployerProfileMutation();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      // Step 1: Register User
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: "employer",
      };

      const userResponse = await registerCompany(userData).unwrap(); // unwrap() throws error if request fails
      console.log(userResponse, "check return data");
      const userId = userResponse.userId;

      // Step 2: Create Employer Profile
      const profileData = {
        user_id: userId,
        company_name: formData.companyName,
        contact_phone: formData.contactPhone,
        address_line: formData.addressLine,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country,
        website_url: formData.websiteUrl,
        industry: formData.industry,
        company_description: formData.companyDescription,
        logo_url: formData.logoUrl,
      };
      await createEmployerProfile(profileData).unwrap();

      alert("Registration and profile completed successfully!");

      window.location.href = "/"; // Redirect to dashboard
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error during registration or profile creation.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="w-full bg-cyan-100 h-2 rounded-full mb-6">
        <div
          className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / steps.length) * 100}%` }}
        />
      </div>
      <div className="text-center font-semibold mb-4">
        Step {step} of {steps.length}: {steps[step - 1]}
      </div>

      {renderStep()}

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={() => dispatch(setStep(step - 1))}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Back
          </button>
        )}
        {step < 5 ? (
          <button
            onClick={() => dispatch(setStep(step + 1))}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
            disabled={isRegistering || isCreatingProfile}
          >
            Next
          </button>
        ) : null}
      </div>
      <div>{data?.data.company_name}</div>
    </div>
  );
}

const Step1 = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.reducer.registration);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        className="w-full border p-2 rounded"
        value={formData.username}
        onChange={(e) => dispatch(updateFormData({ username: e.target.value }))}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={formData.email}
        onChange={(e) => dispatch(updateFormData({ email: e.target.value }))}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        value={formData.password}
        onChange={(e) => dispatch(updateFormData({ password: e.target.value }))}
        required
      />
      <input
        type="password"
        placeholder="confirmPassword"
        className="w-full border p-2 rounded"
        value={formData.confirmPassword}
        onChange={(e) =>
          dispatch(updateFormData({ confirmPassword: e.target.value }))
        }
        required
      />
    </div>
  );
};

const Step2 = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.reducer.registration);

  return (
    <div className="space-y-4">
      refractor
      <input
        type="text"
        placeholder="Company Name"
        className="w-full border p-2 rounded"
        value={formData.companyName}
        onChange={(e) =>
          dispatch(updateFormData({ companyName: e.target.value }))
        }
        required
      />
      <input
        type="tel"
        placeholder="Contact Phone"
        className="w-full border p-2 rounded"
        value={formData.contactPhone}
        onChange={(e) =>
          dispatch(updateFormData({ contactPhone: e.target.value }))
        }
        required
      />
      <input
        type="url"
        placeholder="Website (https://)"
        className="w-full border p-2 rounded"
        value={formData.websiteUrl}
        onChange={(e) =>
          dispatch(updateFormData({ websiteUrl: e.target.value }))
        }
      />
      <input
        type="text"
        placeholder="Industry (e.g. Tech, Healthcare)"
        className="w-full border p-2 rounded"
        value={formData.industry}
        onChange={(e) => dispatch(updateFormData({ industry: e.target.value }))}
        required
      />
    </div>
  );
};

const Step3 = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.reducer.registration);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Office Address Line"
        className="w-full border p-2 rounded"
        value={formData.addressLine}
        onChange={(e) =>
          dispatch(updateFormData({ addressLine: e.target.value }))
        }
      />
      <input
        type="text"
        placeholder="City"
        className="w-full border p-2 rounded"
        value={formData.city}
        onChange={(e) => dispatch(updateFormData({ city: e.target.value }))}
      />
      <input
        type="text"
        placeholder="State/Province"
        className="w-full border p-2 rounded"
        value={formData.state}
        onChange={(e) => dispatch(updateFormData({ state: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Postal Code"
        className="w-full border p-2 rounded"
        value={formData.postalCode}
        onChange={(e) =>
          dispatch(updateFormData({ postalCode: e.target.value }))
        }
      />
      <input
        type="text"
        placeholder="Country"
        className="w-full border p-2 rounded"
        value={formData.country}
        onChange={(e) => dispatch(updateFormData({ country: e.target.value }))}
      />
    </div>
  );
};

const Step4 = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.reducer.registration);

  const handleFileChange = (e) => {
    dispatch(
      updateFormData({ logoUrl: URL.createObjectURL(e.target.files[0]) })
    );
  };

  return (
    <div className="space-y-4">
      <textarea
        placeholder="Company Description"
        rows="5"
        className="w-full border p-2 rounded"
        value={formData.companyDescription}
        onChange={(e) =>
          dispatch(updateFormData({ companyDescription: e.target.value }))
        }
        required
      />
      <input
        type="file"
        accept="image/*"
        className="w-full"
        onChange={handleFileChange}
      />
      {formData.logoUrl && (
        <div className="mt-2">
          <img src={formData.logoUrl} alt="Logo Preview" className="max-h-40" />
        </div>
      )}
    </div>
  );
};

const Step5 = ({ onSubmit }) => {
  const { formData } = useSelector((state) => state.reducer.registration);
  const [registerCompany, { isLoading: isRegistering }] =
    useRegisterCompanyMutation();
  const [createEmployerProfile, { isLoading: isCreatingProfile }] =
    useCreateEmployerProfileMutation();

  return (
    <div className="space-y-2 text-sm text-gray-700">
      <div>
        <strong>Username:</strong> {formData.username}
      </div>
      <div>
        <strong>Email:</strong> {formData.email}
      </div>
      <div>
        <strong>Company Name:</strong> {formData.companyName}
      </div>
      <div>
        <strong>Contact Phone:</strong> {formData.contactPhone}
      </div>
      <div>
        <strong>Website:</strong> {formData.websiteUrl}
      </div>
      <div>
        <strong>Industry:</strong> {formData.industry}
      </div>
      <div>
        <strong>Address:</strong> {formData.addressLine}, {formData.city},{" "}
        {formData.state}, {formData.postalCode}, {formData.country}
      </div>
      <div>
        <strong>Description:</strong> {formData.companyDescription}
      </div>
      <div>
        <strong>Logo:</strong>{" "}
        {formData.logoUrl ? "Uploaded" : "No file selected"}
      </div>
      <button
        onClick={onSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
        disabled={isRegistering || isCreatingProfile}
      >
        {isRegistering || isCreatingProfile ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};
