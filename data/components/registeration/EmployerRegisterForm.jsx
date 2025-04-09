import React, { useState } from "react";

const steps = ["Account", "Company", "Contact", "Description", "Review"];

export default function EmployerRegisterForm() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyRegisterationNumber: null,
    industry: "",
    website: "",
    address: "",
    phone: "",
    description: "",
    logo: null,
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
        return <Step5 formData={formData} />;
      default:
        return null;
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
        ) : (
          <button
            onClick={() => alert("Submitted!")} // Replace with your submit logic
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

const Step1 = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
      />
      <input
        type="text"
        placeholder="Company Registeration Number"
        className="w-full border p-2 rounded"
        value={formData.companyRegisterationNumber}
        onChange={(e) =>
          setFormData({
            ...formData,
            companyRegisterationNumber: e.target.value,
          })
        }
      />
      <input
        type="text"
        placeholder="Industry (e.g. Tech, Healthcare)"
        className="w-full border p-2 rounded"
        value={formData.industry}
        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
      />
      <input
        type="url"
        placeholder="Website (https://)"
        className="w-full border p-2 rounded"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
      />
    </div>
  );
};

function Step3({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Office Address"
        className="w-full border p-2 rounded"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
      <input
        type="tel"
        placeholder="Contact Phone"
        className="w-full border p-2 rounded"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
    </div>
  );
}

function Step4({ formData, setFormData }) {
  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  return (
    <div className="space-y-4">
      <textarea
        placeholder="Company Description"
        rows="5"
        className="w-full border p-2 rounded"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <input
        type="file"
        accept="image/*"
        className="w-full"
        onChange={handleFileChange}
      />

      {formData.logo && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {formData.logo.name}
        </div>
      )}
    </div>
  );
}

function Step5({ formData }) {
  return (
    <div className="space-y-2 text-sm text-white">
      <div>
        <strong>Email:</strong> {formData.email}
      </div>
      <div>
        <strong>Company Name:</strong> {formData.companyName}
      </div>
      <div>
        <strong>Company Registeration Number:</strong>
        {formData.companyRegisterationNumber}
      </div>
      <div>
        <strong>Industry:</strong> {formData.industry}
      </div>
      <div>
        <strong>Website:</strong> {formData.website}
      </div>
      <div>
        <strong>Address:</strong> {formData.address}
      </div>
      <div>
        <strong>Phone:</strong> {formData.phone}
      </div>
      <div>
        <strong>Description:</strong> {formData.description}
      </div>
      <div>
        <strong>Logo:</strong> {formData.logo?.name || "No file selected"}
      </div>
    </div>
  );
}

// import React, { useState } from "react";

// const EmployerRegisterForm = () => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     companyName: "",
//     industry: "",
//     website: "",
//     address: "",
//     phone: "",
//     description: "",
//     logo: null,
//   });

//   const handleSubmit = async () => {
//     const form = new FormData();
//     for (let key in formData) {
//       form.append(key, formData[key]);
//     }

//     await axios.post("/api/employer/register", form, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     // Show success or navigate
//   };

//   return (
//     <div>
//       return (
//       <div className="p-6 max-w-xl mx-auto">
//         {step === 1 && (
//           <Step1_AccountInfo formData={formData} setFormData={setFormData} />
//         )}
//         {step === 2 && (
//           <Step2_CompanyDetails formData={formData} setFormData={setFormData} />
//         )}
//         {step === 3 && (
//           <Step3_ContactInfo formData={formData} setFormData={setFormData} />
//         )}
//         {step === 4 && (
//           <Step4_DescriptionLogo
//             formData={formData}
//             setFormData={setFormData}
//           />
//         )}
//         {step === 5 && <Step5_ReviewSubmit formData={formData} />}

//         <div className="flex justify-between mt-6">
//           {step > 1 && <button onClick={() => setStep(step - 1)}>Back</button>}
//           {step < 5 && <button onClick={() => setStep(step + 1)}>Next</button>}
//         </div>
//       </div>
//       );
//     </div>
//   );
// };

// export default EmployerRegisterForm;

// const Step1_AccountInfo = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Account Information</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="username" className="block text-sm font-medium">
//             Username
//           </label>
//           <input
//             type="text"
//             id="username"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="email" className="block text-sm font-medium">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="password" className="block text-sm font-medium">
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step2_CompanyInfo = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Information</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="company-name" className="block text-sm font-medium">
//             Company Name
//           </label>
//           <input
//             type="text"
//             id="company-name"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="company-email" className="block text-sm font-medium">
//             Company Email
//           </label>
//           <input
//             type="email"
//             id="company-email"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step3_CompanyAddress = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Address</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="address" className="block text-sm font-medium">
//             Address
//           </label>
//           <input
//             type="text"
//             id="address"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="city" className="block text-sm font-medium">
//             City
//           </label>
//           <input
//             type="text"
//             id="city"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step4_CompanyLogo = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Logo</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="logo" className="block text-sm font-medium">
//             Upload Company Logo
//           </label>
//           <input
//             type="file"
//             id="logo"
//             accept="image/*"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step5_CompanyDescription = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Description</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="description" className="block text-sm font-medium">
//             Description
//           </label>
//           <textarea
//             id="description"
//             rows="4"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           ></textarea>
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step6_CompanyWebsite = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Website</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="website" className="block text-sm font-medium">
//             Website URL
//           </label>
//           <input
//             type="url"
//             id="website"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step7_CompanySocialMedia = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Social Media</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="social-media" className="block text-sm font-medium">
//             Social Media Links
//           </label>
//           <input
//             type="url"
//             id="social-media"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step8_CompanyPhone = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Phone Number</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="phone" className="block text-sm font-medium">
//             Phone Number
//           </label>
//           <input
//             type="tel"
//             id="phone"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step9_CompanyIndustry = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Industry</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="industry" className="block text-sm font-medium">
//             Industry
//           </label>
//           <input
//             type="text"
//             id="industry"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step10_CompanySize = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Size</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="size" className="block text-sm font-medium">
//             Size
//           </label>
//           <input
//             type="number"
//             id="size"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step11_CompanyType = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Type</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="type" className="block text-sm font-medium">
//             Type
//           </label>
//           <input
//             type="text"
//             id="type"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step12_CompanyTaxID = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Tax ID</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="tax-id" className="block text-sm font-medium">
//             Tax ID
//           </label>
//           <input
//             type="text"
//             id="tax-id"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step13_CompanyRegistrationNumber = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Registration Number</h2>
//       <form>
//         <div className="mb-4">
//           <label
//             htmlFor="registration-number"
//             className="block text-sm font-medium"
//           >
//             Registration Number
//           </label>
//           <input
//             type="text"
//             id="registration-number"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step14_CompanyBankDetails = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Bank Details</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="bank-details" className="block text-sm font-medium">
//             Bank Details
//           </label>
//           <input
//             type="text"
//             id="bank-details"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step15_CompanyPrivacyPolicy = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Privacy Policy</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="privacy-policy" className="block text-sm font-medium">
//             Privacy Policy
//           </label>
//           <textarea
//             id="privacy-policy"
//             rows="4"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           ></textarea>
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step16_CompanyTermsConditions = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Terms & Conditions</h2>
//       <form>
//         <div className="mb-4">
//           <label
//             htmlFor="terms-conditions"
//             className="block text-sm font-medium"
//           >
//             Terms & Conditions
//           </label>
//           <textarea
//             id="terms-conditions"
//             rows="4"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           ></textarea>
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step17_CompanyVerificationDocuments = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Verification Documents</h2>
//       <form>
//         <div className="mb-4">
//           <label
//             htmlFor="verification-documents"
//             className="block text-sm font-medium"
//           >
//             Upload Verification Documents
//           </label>
//           <input
//             type="file"
//             id="verification-documents"
//             accept=".pdf,.doc,.docx"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step18_CompanyReferences = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company References</h2>
//       <form>
//         <div className="mb-4">
//           <label htmlFor="references" className="block text-sm font-medium">
//             References
//           </label>
//           <textarea
//             id="references"
//             rows="4"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           ></textarea>
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step19_CompanyAdditionalInfo = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Additional Information</h2>
//       <form>
//         <div className="mb-4">
//           <label
//             htmlFor="additional-info"
//             className="block text-sm font-medium"
//           >
//             Additional Information
//           </label>
//           <textarea
//             id="additional-info"
//             rows="4"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           ></textarea>
//         </div>
//       </form>
//     </div>
//   );
// };
// const Step20_CompanySubmit = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Submit Registration</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Submit
//       </button>
//     </div>
//   );
// };
// const Step21_CompanyCancel = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Cancel Registration</h2>
//       <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
//         Cancel
//       </button>
//     </div>
//   );
// };
// const Step22_CompanyBack = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Back to Previous Step</h2>
//       <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md">
//         Back
//       </button>
//     </div>
//   );
// };
// const Step23_CompanyNext = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Next Step</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Next
//       </button>
//     </div>
//   );
// };
// const Step24_CompanyFinish = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Finish Registration</h2>
//       <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">
//         Finish
//       </button>
//     </div>
//   );
// };
// const Step25_CompanySave = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Save Registration</h2>
//       <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md">
//         Save
//       </button>
//     </div>
//   );
// };
// const Step26_CompanyPreview = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Preview Registration</h2>
//       <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md">
//         Preview
//       </button>
//     </div>
//   );
// };
// const Step27_CompanyEdit = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Edit Registration</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Edit
//       </button>
//     </div>
//   );
// };
// const Step28_CompanyDelete = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Delete Registration</h2>
//       <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
//         Delete
//       </button>
//     </div>
//   );
// };
// const Step29_CompanyUpdate = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Update Registration</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Update
//       </button>
//     </div>
//   );
// };
// const Step30_CompanyRefresh = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Refresh Registration</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Refresh
//       </button>
//     </div>
//   );
// };
// const Step31_CompanySettings = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Settings</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Settings
//       </button>
//     </div>
//   );
// };
// const Step32_CompanyHelp = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Help</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Help
//       </button>
//     </div>
//   );
// };
// const Step33_CompanySupport = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Support</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Support
//       </button>
//     </div>
//   );
// };
// const Step34_CompanyFeedback = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Feedback</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Feedback
//       </button>
//     </div>
//   );
// };
// const Step35_CompanyLogout = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Logout</h2>
//       <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
//         Logout
//       </button>
//     </div>
//   );
// };
// const Step36_CompanyLogin = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Login</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Login
//       </button>
//     </div>
//   );
// };
// const Step37_CompanyRegister = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Register</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Register
//       </button>
//     </div>
//   );
// };
// const Step38_CompanyForgotPassword = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Forgot Password</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Forgot Password
//       </button>
//     </div>
//   );
// };
// const Step39_CompanyResetPassword = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Reset Password</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Reset Password
//       </button>
//     </div>
//   );
// };
// const Step40_CompanyChangePassword = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Change Password</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Change Password
//       </button>
//     </div>
//   );
// };
// const Step41_CompanyUpdateProfile = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Update Profile</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Update Profile
//       </button>
//     </div>
//   );
// };
// const Step42_CompanyViewProfile = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company View Profile</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         View Profile
//       </button>
//     </div>
//   );
// };
// const Step43_CompanyDeleteProfile = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Delete Profile</h2>
//       <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
//         Delete Profile
//       </button>
//     </div>
//   );
// };
// const Step44_CompanyDeactivateProfile = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Deactivate Profile</h2>
//       <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md">
//         Deactivate Profile
//       </button>
//     </div>
//   );
// };
// const Step45_CompanyActivateProfile = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Activate Profile</h2>
//       <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">
//         Activate Profile
//       </button>
//     </div>
//   );
// };
// const Step46_CompanyEnableTwoFactorAuth = () => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold">Company Enable Two-Factor Auth</h2>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
//         Enable Two-Factor Auth
//       </button>
//     </div>
//   );
// };
