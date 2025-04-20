import React, { useState } from "react";
import { useCreateNewEmployerProfileMutation } from "../../redux/api/employerApi";

const steps = ["Account", "Company", "Contact", "Description", "Review"];

const CreateEmployerProfile = () => {
  const [step, setStep] = useState(1); // Start at 0 to align with array indices

  const [formData, setFormData] = useState({
    brandName: "",
    registeredNumber: "", // Added field
    contactPhone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    websiteUrl: "",
    industry: "IT",
    companyDescription: "",
    logoUrl: null,
  });

  // const [registerEmployer, { isLoading: isRegistering, error: registerError }] =
  //   useRegisterEmployerMutation();
  const [
    createEmployerProfile,
    { isLoading: isSavingProfile, error: profileError },
  ] = useCreateNewEmployerProfileMutation();

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          // <Step1
          //   formData={formData}
          //   setFormData={setFormData}
          //   onNext={handleStep1Next}
          //   isRegistering={isRegistering}
          //   registerError={registerError}
          // />
          <div>Let Creaate New</div>
        );
      case 1:
        return <Step2 formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step3 formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step4 formData={formData} setFormData={setFormData} />;
      case 4:
        return (
          <Step5
            formData={formData}
            onSubmit={handleFinalSubmit}
            isSavingProfile={isSavingProfile}
            profileError={profileError}
          />
        );
      default:
        return null;
    }
  };

  // const handleStep1Next = async () => {
  //   const employerData = {
  //     username: formData.username,
  //     email: formData.employerEmail,
  //     password: formData.password,
  //     confirmPassword: formData.confirmPassword,
  //     role: "employer",
  //   };

  //   try {
  //     const response = await registerEmployer(employerData).unwrap();
  //     setUserId(response.userId); // Assuming backend returns userId
  //     setStep(1); // Move to Step 2
  //   } catch (error) {
  //     console.error("Registration failed:", error);
  //   }
  // };

  const handleFinalSubmit = async () => {
    const profileData = {
      company_name: formData.brandName,
      registered_number: formData.registeredNumber || null, // Allow null if empty
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

    try {
      await createEmployerProfile(profileData).unwrap();
      alert("Profile saved successfully!");
      window.location.href = "/profile/employer";
    } catch (error) {
      console.error("Profile save failed:", error);
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="w-full bg-cyan-100 h-2 rounded-full mb-6">
        <div
          className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }} // Adjusted for 0-based index
        />
      </div>
      <div className="text-center font-semibold mb-4">
        Step {step + 1} of {steps.length}: {steps[step]}
      </div>

      {renderStep()}

      <div className="flex justify-between mt-6">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Back
          </button>
        )}
        {step < steps.length - 1 && (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-cyan-900 text-white rounded hover:bg-blue-700 ml-auto"
            disabled={isSavingProfile}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

// // Step 1 Component
// const Step1 = ({
//   formData,
//   setFormData,
//   onNext,
//   isRegistering,
//   registerError,
// }) => {
//   return (
//     <div className="space-y-4">
//       <input
//         type="text"
//         placeholder="Username"
//         className="w-full border p-2 rounded"
//         value={formData.username}
//         onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//         required
//       />
//       <input
//         type="email"
//         placeholder="example@mail.com"
//         className="w-full border p-2 rounded"
//         value={formData.employerEmail}
//         onChange={(e) =>
//           setFormData({ ...formData, employerEmail: e.target.value })
//         }
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="w-full border p-2 rounded"
//         value={formData.password}
//         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Confirm Password"
//         className="w-full border p-2 rounded"
//         value={formData.confirmPassword}
//         onChange={(e) =>
//           setFormData({ ...formData, confirmPassword: e.target.value })
//         }
//         required
//       />
//       {registerError && (
//         <p className="text-red-500">
//           {registerError.data?.message || "Registration failed."}
//         </p>
//       )}
//       <button
//         onClick={onNext}
//         className="px-4 py-2 bg-cyan-900 text-white rounded hover:bg-blue-700 w-full"
//         disabled={isRegistering}
//       >
//         {isRegistering ? "Registering..." : "Register & Next"}
//       </button>
//     </div>
//   );
// };
const Step1 = () => {
  return (
    <div>
      <h1>Let's Create a New Profile</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem minus
        unde beatae vero corporis qui similique mollitia ipsa explicabo amet
        doloribus possimus suscipit pariatur, architecto sequi distinctio! Quod,
        sit dolore?
      </p>
    </div>
  );
};

// Step 2 Component (Added registeredNumber)
const Step2 = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Company Name"
        className="w-full border p-2 rounded"
        value={formData.brandName}
        onChange={(e) =>
          setFormData({ ...formData, brandName: e.target.value })
        }
        required
      />
      <input
        type="text"
        placeholder="Registered Number (optional)"
        className="w-full border p-2 rounded"
        value={formData.registeredNumber}
        onChange={(e) =>
          setFormData({ ...formData, registeredNumber: e.target.value })
        }
      />
      <input
        type="tel"
        placeholder="Contact Phone"
        className="w-full border p-2 rounded"
        value={formData.contactPhone}
        onChange={(e) =>
          setFormData({ ...formData, contactPhone: e.target.value })
        }
        required
      />
      <input
        type="url"
        placeholder="Website (optional, https://example.com)"
        className="w-full border p-2 rounded"
        value={formData.websiteUrl}
        onChange={(e) =>
          setFormData({ ...formData, websiteUrl: e.target.value })
        }
      />
      <select
        className="w-full border p-2 rounded"
        value={formData.industry}
        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
      >
        <option value="IT">IT</option>
        <option value="Finance">Finance</option>
        <option value="Engineering">Engineering</option>
        <option value="Chief">Chief</option>
      </select>
    </div>
  );
};

// Step 3 Component
const Step3 = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Office Address Line (optional)"
        className="w-full border p-2 rounded"
        value={formData.addressLine}
        onChange={(e) =>
          setFormData({ ...formData, addressLine: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="City (optional)"
        className="w-full border p-2 rounded"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
      />
      <input
        type="text"
        placeholder="State/Province (optional)"
        className="w-full border p-2 rounded"
        value={formData.state}
        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
      />
      <input
        type="text"
        placeholder="Postal Code (optional)"
        className="w-full border p-2 rounded"
        value={formData.postalCode}
        onChange={(e) =>
          setFormData({ ...formData, postalCode: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Country (optional)"
        className="w-full border p-2 rounded"
        value={formData.country}
        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
      />
    </div>
  );
};

// Step 4 Component
const Step4 = ({ formData, setFormData }) => {
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      logoUrl: URL.createObjectURL(e.target.files[0]),
    });
  };

  return (
    <div className="space-y-4">
      <textarea
        placeholder="Company Description"
        rows="5"
        className="w-full border p-2 rounded"
        value={formData.companyDescription}
        onChange={(e) =>
          setFormData({ ...formData, companyDescription: e.target.value })
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

// Step 5 Component (Added registeredNumber to review)
const Step5 = ({ formData, onSubmit, isSavingProfile, profileError }) => {
  return (
    <div className="space-y-2 text-sm text-gray-700">
      <div>
        <strong>Company Name:</strong> {formData.brandName}
      </div>
      <div>
        <strong>Registered Number:</strong> {formData.registeredNumber || "N/A"}
      </div>
      <div>
        <strong>Contact Phone:</strong> {formData.contactPhone}
      </div>
      <div>
        <strong>Website:</strong> {formData.websiteUrl || "N/A"}
      </div>
      <div>
        <strong>Industry:</strong> {formData.industry}
      </div>
      <div>
        <strong>Address:</strong>{" "}
        {`${formData.addressLine || ""}${formData.addressLine && ", "}${
          formData.city || ""
        }${formData.city && ", "}${formData.state || ""}${
          formData.state && ", "
        }${formData.postalCode || ""}${formData.postalCode && ", "}${
          formData.country || ""
        }` || "N/A"}
      </div>
      <div>
        <strong>Description:</strong> {formData.companyDescription}
      </div>
      <div>
        <strong>Logo:</strong>{" "}
        {formData.logoUrl ? "Uploaded" : "No file selected"}
      </div>
      {profileError && (
        <p className="text-red-500">
          {profileError.data?.message || "Profile save failed."}
        </p>
      )}
      <button
        onClick={onSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
        disabled={isSavingProfile}
      >
        {isSavingProfile ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export { Step1, Step2, Step3, Step4, Step5 };
export default CreateEmployerProfile;
