import React from "react";
import { useForm } from "react-hook-form";
import { useLoginCompanyMutation } from "../../redux/api/registerApi";

const SignIn = () => {
  const {
    register, // Changed 'login' to 'register'
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginCompany, { isLoading: isLogin, isSuccess, isError, error }] =
    useLoginCompanyMutation(); // Destructured more return values

  if (isLogin) return <p>Loading...</p>;

  if (isSuccess) return <p>Successfully logged in!</p>; // Added success message

  if (isError) {
    // Added error handling
    return <p>Login failed. {error?.data?.message || "Please try again."}</p>;
  }

  return (
    <div>
      <h1>Company SignIn</h1>
      <form onSubmit={handleSubmit((data) => loginCompany(data))}>
        <input
          {...register("email", { required: "Email is required" })} // Changed 'require' to 'required' and added a message
          placeholder="Email" // Added a placeholder
        />
        {errors.email && <p>{errors.email.message}</p>}{" "}
        {/* Display specific error message */}
        <input
          type="password" // Added type="password"
          {...register("password", { required: "Password is required" })} // Changed 'require' to 'required' and added a message
          placeholder="Password" // Added a placeholder
        />
        {errors.password && <p>{errors.password.message}</p>}{" "}
        {/* Display specific error message */}
        <button type="submit">Sign In</button>{" "}
        {/* Changed input type="submit" to a button */}
      </form>
    </div>
  );
};

export default SignIn;

// import React from "react";
// import { useForm } from "react-hook-form";
// import { useLoginCompanyMutation } from "../../redux/api/registerApi";

// const SignIn = () => {
//   const {
//     login,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const [loginCompany, { isLoading: isLogin }] = useLoginCompanyMutation();

//   if (isLogin) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Company SignIn</h1>
//       <form onSubmit={handleSubmit((data) => loginCompany(data))}>
//         <input {...login("email", { require: true })} />
//         {errors.email && <p>Please check you email.</p>}
//         <input {...login("password", { require: true })} />
//         {errors.password && <p>Please check you password</p>}
//         <input type="submit" />
//       </form>
//     </div>
//   );
// };

// export default SignIn;

// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   setStep,
//   setRegistrationSuccess,
//   setUserId,
//   setProfileCompleted,
//   updateFormData,
// } from "../../redux/slice/registerationSlice";

// const steps = ["Account", "Company", "Contact", "Description", "Review"];

// export default function SignIn() {
//   const dispatch = useDispatch();
//   const { step, registrationSuccess, userId, profileCompleted, formData } =
//     useSelector((state) => state.reducer.registration);

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return <Step1 />;
//       case 2:
//         return <Step2 />;
//       case 3:
//         return <Step3 />;
//       case 4:
//         return <Step4 />;
//       case 5:
//         return <Step5 onSubmit={handleSubmit} />;
//       default:
//         return null;
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const userRegistrationResponse = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username: formData.username,
//           email: formData.email,
//           password: formData.password,
//           role: "employer",
//         }),
//       });

//       if (userRegistrationResponse.ok) {
//         const userData = await userRegistrationResponse.json();
//         dispatch(setUserId(userData.userId));
//         dispatch(setRegistrationSuccess(true));
//         dispatch(setStep(2));

//         try {
//           const profileData = {
//             user_id: userData.userId,
//             company_name: formData.companyName,
//             contact_phone: formData.contactPhone,
//             address_line: formData.addressLine,
//             city: formData.city,
//             state: formData.state,
//             postal_code: formData.postalCode,
//             country: formData.country,
//             website_url: formData.websiteUrl,
//             industry: formData.industry,
//             company_description: formData.companyDescription,
//             logo_url: formData.logoUrl,
//           };

//           const profileSaveResponse = await fetch("/api/employer/profile", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(profileData),
//           });

//           if (profileSaveResponse.ok) {
//             dispatch(setProfileCompleted(true));
//             alert("Registration and profile completed successfully!");
//             window.location.href = "/dashboard";
//           } else {
//             console.error(
//               "Error saving employer profile:",
//               await profileSaveResponse.text()
//             );
//             alert("Error saving employer profile.");
//           }
//         } catch (error) {
//           console.error("Error saving employer profile:", error);
//           alert("Error saving employer profile.");
//         }
//       } else {
//         console.error(
//           "Error during user registration:",
//           await userRegistrationResponse.text()
//         );
//         alert("Error during user registration.");
//       }
//     } catch (error) {
//       console.error("Error during user registration:", error);
//       alert("Error during user registration.");
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <div className="w-full bg-cyan-100 h-2 rounded-full mb-6">
//         <div
//           className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
//           style={{ width: `${(step / steps.length) * 100}%` }}
//         />
//       </div>
//       <div className="text-center font-semibold mb-4">
//         Step {step} of {steps.length}: {steps[step - 1]}
//       </div>

//       {renderStep()}

//       <div className="flex justify-between mt-6">
//         {step > 1 && (
//           <button
//             onClick={() => dispatch(setStep(step - 1))}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//           >
//             Back
//           </button>
//         )}
//         {step < 5 ? (
//           <button
//             onClick={() => dispatch(setStep(step + 1))}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
//           >
//             Next
//           </button>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// const Step1 = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector((state) => state.registration);

//   return (
//     <div className="space-y-4">
//       <input
//         type="text"
//         placeholder="Username"
//         className="w-full border p-2 rounded"
//         value={formData.username}
//         onChange={(e) => dispatch(updateFormData({ username: e.target.value }))}
//         required
//       />
//       <input
//         type="email"
//         placeholder="Email"
//         className="w-full border p-2 rounded"
//         value={formData.email}
//         onChange={(e) => dispatch(updateFormData({ email: e.target.value }))}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="w-full border p-2 rounded"
//         value={formData.password}
//         onChange={(e) => dispatch(updateFormData({ password: e.target.value }))}
//         required
//       />
//     </div>
//   );
// };

// const Step2 = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector((state) => state.registration);

//   return (
//     <div className="space-y-4">
//       <input
//         type="text"
//         placeholder="Company Name"
//         className="w-full border p-2 rounded"
//         value={formData.companyName}
//         onChange={(e) =>
//           dispatch(updateFormData({ companyName: e.target.value }))
//         }
//         required
//       />
//       <input
//         type="tel"
//         placeholder="Contact Phone"
//         className="w-full border p-2 rounded"
//         value={formData.contactPhone}
//         onChange={(e) =>
//           dispatch(updateFormData({ contactPhone: e.target.value }))
//         }
//         required
//       />
//       <input
//         type="url"
//         placeholder="Website (https://)"
//         className="w-full border p-2 rounded"
//         value={formData.websiteUrl}
//         onChange={(e) =>
//           dispatch(updateFormData({ websiteUrl: e.target.value }))
//         }
//       />
//       <input
//         type="text"
//         placeholder="Industry (e.g. Tech, Healthcare)"
//         className="w-full border p-2 rounded"
//         value={formData.industry}
//         onChange={(e) => dispatch(updateFormData({ industry: e.target.value }))}
//         required
//       />
//     </div>
//   );
// };

// const Step3 = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector((state) => state.registration);

//   return (
//     <div className="space-y-4">
//       <input
//         type="text"
//         placeholder="Office Address Line"
//         className="w-full border p-2 rounded"
//         value={formData.addressLine}
//         onChange={(e) =>
//           dispatch(updateFormData({ addressLine: e.target.value }))
//         }
//       />
//       <input
//         type="text"
//         placeholder="City"
//         className="w-full border p-2 rounded"
//         value={formData.city}
//         onChange={(e) => dispatch(updateFormData({ city: e.target.value }))}
//       />
//       <input
//         type="text"
//         placeholder="State/Province"
//         className="w-full border p-2 rounded"
//         value={formData.state}
//         onChange={(e) => dispatch(updateFormData({ state: e.target.value }))}
//       />
//       <input
//         type="text"
//         placeholder="Postal Code"
//         className="w-full border p-2 rounded"
//         value={formData.postalCode}
//         onChange={(e) =>
//           dispatch(updateFormData({ postalCode: e.target.value }))
//         }
//       />
//       <input
//         type="text"
//         placeholder="Country"
//         className="w-full border p-2 rounded"
//         value={formData.country}
//         onChange={(e) => dispatch(updateFormData({ country: e.target.value }))}
//       />
//     </div>
//   );
// };

// const Step4 = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector((state) => state.registration);

//   const handleFileChange = (e) => {
//     dispatch(
//       updateFormData({ logoUrl: URL.createObjectURL(e.target.files[0]) })
//     );
//   };

//   return (
//     <div className="space-y-4">
//       <textarea
//         placeholder="Company Description"
//         rows="5"
//         className="w-full border p-2 rounded"
//         value={formData.companyDescription}
//         onChange={(e) =>
//           dispatch(updateFormData({ companyDescription: e.target.value }))
//         }
//         required
//       />
//       <input
//         type="file"
//         accept="image/*"
//         className="w-full"
//         onChange={handleFileChange}
//       />
//       {formData.logoUrl && (
//         <div className="mt-2">
//           <img src={formData.logoUrl} alt="Logo Preview" className="max-h-40" />
//         </div>
//       )}
//     </div>
//   );
// };

// const Step5 = ({ onSubmit }) => {
//   const { formData } = useSelector((state) => state.registration);

//   return (
//     <div className="space-y-2 text-sm text-gray-700">
//       <div>
//         <strong>Username:</strong> {formData.username}
//       </div>
//       <div>
//         <strong>Email:</strong> {formData.email}
//       </div>
//       <div>
//         <strong>Company Name:</strong> {formData.companyName}
//       </div>
//       <div>
//         <strong>Contact Phone:</strong> {formData.contactPhone}
//       </div>
//       <div>
//         <strong>Website:</strong> {formData.websiteUrl}
//       </div>
//       <div>
//         <strong>Industry:</strong> {formData.industry}
//       </div>
//       <div>
//         <strong>Address:</strong> {formData.addressLine}, {formData.city},{" "}
//         {formData.state}, {formData.postalCode}, {formData.country}
//       </div>
//       <div>
//         <strong>Description:</strong> {formData.companyDescription}
//       </div>
//       <div>
//         <strong>Logo:</strong>{" "}
//         {formData.logoUrl ? "Uploaded" : "No file selected"}
//       </div>
//       <button
//         onClick={onSubmit}
//         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
//       >
//         Submit
//       </button>
//     </div>
//   );
// };
