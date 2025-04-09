import React, { useState } from "react";

const steps = ["Account", "Company", "Contact", "Description", "Review"];

export default function Register() {
  const [step, setStep] = useState(1);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userId, setUserId] = useState(null); // To store the user ID after initial registration
  const [profileCompleted, setProfileCompleted] = useState(false); // To track profile completion

  const [formData, setFormData] = useState({
    username: "", // Added username field
    companyEmail: "",
    password: "",
    companyName: "",
    contactPhone: "", // Changed from companyRegisterationNumber and phone to match employer_profiles
    addressLine: "", // Renamed for clarity
    city: "", // Added for address details
    state: "", // Added for address details
    postalCode: "", // Added for address details
    country: "", // Added for address details
    websiteUrl: "", // Renamed for consistency
    industry: "",
    companyDescription: "", // Renamed for consistency
    logoUrl: null, // Assuming you'll handle the URL after upload
  });

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step2 formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3 formData={formData} setFormData={setFormData} />;
      case 4:
        return <Step4 formData={formData} setFormData={setFormData} />;
      case 5:
        return (
          <Step5
            formData={formData}
            onSubmit={handleSubmit} // Pass the submit handler
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    // --- Step 1: Register User (Send username, email, password to back-end) ---
    try {
      const userRegistrationResponse = await fetch("/api/register", {
        // Replace with your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: "employer", // Set the role to employer
        }),
      });

      if (userRegistrationResponse.ok) {
        const userData = await userRegistrationResponse.json();
        setUserId(userData.userId); // Assuming the back-end returns the new user ID
        setRegistrationSuccess(true);
        setStep(2); // Move to the next step after successful registration

        // --- Step 2: Save Employer Profile (Send profile data to back-end) ---
        try {
          const profileData = {
            user_id: userData.userId,
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
            logo_url: formData.logoUrl, // Handle logo upload separately if needed
          };

          const profileSaveResponse = await fetch("/api/employer/profile", {
            // Replace with your API endpoint
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(profileData),
          });

          if (profileSaveResponse.ok) {
            setProfileCompleted(true);
            alert("Registration and profile completed successfully!");
            // Redirect to the main application page
            window.location.href = "/dashboard"; // Replace with your dashboard URL
          } else {
            console.error(
              "Error saving employer profile:",
              await profileSaveResponse.text()
            );
            alert("Error saving employer profile.");
            // Optionally handle rollback or allow the user to retry
          }
        } catch (error) {
          console.error("Error saving employer profile:", error);
          alert("Error saving employer profile.");
        }
      } else {
        console.error(
          "Error during user registration:",
          await userRegistrationResponse.text()
        );
        alert("Error during user registration.");
      }
    } catch (error) {
      console.error("Error during user registration:", error);
      alert("Error during user registration.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
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

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Back
          </button>
        )}
        {step < 5 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
          >
            Next
          </button>
        ) : null}{" "}
        {/* Hide Next button on the last step */}
      </div>
    </div>
  );
}

const Step1 = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        className="w-full border p-2 rounded"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
    </div>
  );
};

const Step2 = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Company Name"
        className="w-full border p-2 rounded"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
        required
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
        placeholder="Website (https://)"
        className="w-full border p-2 rounded"
        value={formData.websiteUrl}
        onChange={(e) =>
          setFormData({ ...formData, websiteUrl: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Industry (e.g. Tech, Healthcare)"
        className="w-full border p-2 rounded"
        value={formData.industry}
        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
        required
      />
    </div>
  );
};

function Step3({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Office Address Line"
        className="w-full border p-2 rounded"
        value={formData.addressLine}
        onChange={(e) =>
          setFormData({ ...formData, addressLine: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="City"
        className="w-full border p-2 rounded"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
      />
      <input
        type="text"
        placeholder="State/Province"
        className="w-full border p-2 rounded"
        value={formData.state}
        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
      />
      <input
        type="text"
        placeholder="Postal Code"
        className="w-full border p-2 rounded"
        value={formData.postalCode}
        onChange={(e) =>
          setFormData({ ...formData, postalCode: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Country"
        className="w-full border p-2 rounded"
        value={formData.country}
        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
      />
    </div>
  );
}

function Step4({ formData, setFormData }) {
  const handleFileChange = (e) => {
    // In a real application, you would likely upload the logo to a server here
    // and store the URL in formData.logoUrl
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
}

function Step5({ formData, onSubmit }) {
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
      >
        Submit
      </button>
    </div>
  );
}
