import React, { useState } from "react";
import { useUploadProfileImageMutation } from "../redux/api/userApi";
import UploadForm from "./UploadForm";

const Upload = () => {
  const [imageFile, setImageFile] = useState();

  const [uploadProfileImage, { isLoading: isUploadProfileImageLoading }] =
    useUploadProfileImageMutation();

  // const handleFileChange = (e) => {
  //   console.log("Hi", e);
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // const handleUpload = async () => {
  //   if (imageFile) {
  //     console.log("No valid file selected for upload");
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("image", imageFile);

  //   try {
  //     const result = await uploadProfileImage(formData).unwrap();
  //     console.log("UPLOAD SUCCESS", result);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleUpload = async () => {
    if (!imageFile) {
      console.log("No valid file selected for upload");
      return;
    }
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const result = await uploadProfileImage(formData).unwrap();
      console.log("UPLOAD SUCCESS", result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-center text-3xl p-2  m-1">Image Upload Page</h1>
        <input
          type="file"
          id="image"
          onChange={handleFileChange}
          // accept=".pdf,.doc,.docx,"
          // accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" // Helps user select correct files
          className="bg-green-500 p-2 m-1"
        />

        <button
          onClick={handleUpload}
          // Disable if loading or if no file is selected
          disabled={isUploadProfileImageLoading || !imageFile}
          className={`p-2 m-1  ${
            isUploadProfileImageLoading || !imageFile
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isUploadProfileImageLoading ? "Uploading...." : "Upload Resume"}
        </button>
        {/* Display file info only if a file is selected */}
        {imageFile && (
          <p className="underline mt-2">
            Selected filesize: {(imageFile.size / 1024).toFixed(2)} KB
          </p>
        )}
      </div>
      <div>
        <h1>2 File upload </h1>
        <UploadForm />
      </div>
    </div>
  );
};

export default Upload;
