import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  useDeleteResumeMutation,
  useGetResumeQuery,
  usePreviewResumeQuery,
  useUploadResumeMutation,
} from "../../redux/api/userApi";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css"; // Also recommended for text selection

// Set workerSrc for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Resume = () => {
  const [resumeFile, setResumeFile] = useState();
  const [filenamePreview, setFilenamePreview] = useState();

  const [
    uploadResume,
    { isLoading: isFileLoading, isSuccess: isFileSuccess, error: errorFile },
  ] = useUploadResumeMutation();

  const {
    data: getResume,
    isLoading: isGetResumeLoading,
    refetch,
  } = useGetResumeQuery(); // console.log(getResume, " resume ");

  const {
    data: fileURL,
    isLoading: isFileURLLoading,
    error: isFileURLError,
  } = usePreviewResumeQuery(filenamePreview, { skip: !filenamePreview });

  const [deleteResume, { isLoading: isDeleting }] = useDeleteResumeMutation();

  // if (isDeleting) return <p>Loading ..</p>;
  if (isFileURLError) return <p>Error...</p>;
  // console.log(fileURL, "data from backend ");

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // setResumeFile(e.target.files[0]); // finished
    if (file) {
      setResumeFile(file);
      console.log("Selected file:", file);
    } else {
      setResumeFile(null);
      console.log("No file selected");
    }
  };

  const handleUpload = async () => {
    // console.log("File Upload", resumeFile);
    if (!resumeFile || !resumeFile.name) {
      console.log("No valid file selected for upload.");
      // Optionally show a user message here
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const result = await uploadResume(formData).unwrap();
      refetch();
      console.log("Upload success:", result);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="p-4 border rounded">
      <div>
        <h1>Uploaded File</h1>
        {isGetResumeLoading ? (
          <p className="bg-red-500 h-96 w-full"> Get Resume Loading </p>
        ) : (
          <div>
            {getResume?.data.map((resume) => (
              <div key={resume.id} className=" p-2 m-1">
                <div className=" p-2 m-1">
                  <h1>{resume.file_name}</h1>
                  <p>{resume.uploaded_at}</p>
                  <button
                    onClick={() => setFilenamePreview(resume.file_name)}
                    className=" bg-green-500 p-2"
                  >
                    Click Preview
                  </button>
                  {/* --- Download Button --- */}
                  {/* Using a standard <a> tag with download attribute */}
                  <a
                    // IMPORTANT: Replace '/api/user/resume/download/' with your actual backend path
                    href={`/api/user/resume/download/${resume.file_name}`}
                    download={resume.file_name} // Suggests the filename to the browser
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 m-1 inline-block" // Use inline-block to apply padding like a button
                  >
                    Download
                  </a>
                  {/* --- End Download Button --- */}
                  <button
                    // onClick={() =>
                    //   deleteResume(resume.id).then(() => refetch())
                    // }
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this resume?")
                      ) {
                        deleteResume(resume.id).then(() => refetch());
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded ml-2"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
                {filenamePreview === resume.file_name &&
                  (isFileURLLoading ? (
                    <>
                      <p className="bg-green-500 h-screen">Loading....FILE </p>
                    </>
                  ) : (
                    <div className="max-h-screen max-w-10">
                      <Document
                        file={fileURL}
                        onLoadError={(error) =>
                          console.error("PDF load error:", error)
                        }
                      >
                        <Page pageNumber={1} width={600} />
                      </Document>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h1 className="text-center text-3xl p-2  m-1">Resume Upload Page</h1>
        <input
          type="file"
          id="resume"
          onChange={handleFileChange}
          // accept=".pdf,.doc,.docx,"
          accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" // Helps user select correct files
          className="bg-green-500 p-2 m-1"
        />

        <button
          onClick={handleUpload}
          // Disable if loading or if no file is selected
          disabled={isFileLoading || !resumeFile}
          className={`p-2 m-1  ${
            isFileLoading || !resumeFile
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isFileLoading ? "Uploading...." : "Upload Resume"}
        </button>
        {/* Display file info only if a file is selected */}
        {resumeFile && (
          <p className="underline mt-2">
            Selected filesize: {(resumeFile.size / 1024).toFixed(2)} KB
          </p>
        )}
      </div>
      <div>
        <div>
          {isFileSuccess && (
            <p className="text-green-500">Resume Uploaded Successfully!</p>
          )}
        </div>
        <div>
          {errorFile && (
            <p className="text-red-500 mt-2">
              Error: {errorFile.data?.message || "Upload failed"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;

// import React, { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import {
//   useDeleteResumeMutation,
//   useGetResumeQuery,
//   usePreviewResumeQuery,
//   useUploadResumeMutation,
// } from "../../redux/api/userApi";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// // Set workerSrc for react-pdf
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// const Resume = () => {
//   const [resumeFile, setResumeFile] = useState(null);
//   const [filenamePreview, setFilenamePreview] = useState(null);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const [
//     uploadResume,
//     { isLoading: isFileLoading, isSuccess: isFileSuccess, error: errorFile },
//   ] = useUploadResumeMutation();

//   const {
//     data: getResume,
//     isLoading: isGetResumeLoading,
//     refetch,
//   } = useGetResumeQuery();

//   const {
//     data: fileURL,
//     isLoading: isFileURLLoading,
//     error: isFileURLError,
//   } = usePreviewResumeQuery(filenamePreview, { skip: !filenamePreview });

//   const [deleteResume, { isLoading: isDeleting }] = useDeleteResumeMutation();

//   if (isFileURLError) return <p className="text-red-500 text-center">Error loading resume preview.</p>;

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setResumeFile(file);
//     } else {
//       setResumeFile(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!resumeFile || !resumeFile.name) {
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", resumeFile);

//     try {
//       await uploadResume(formData).unwrap();
//       refetch();
//       setResumeFile(null);
//       setCurrentSlide(0);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   const handleDelete = async (resumeId) => {
//     if (confirm("Are you sure you want to delete this resume?")) {
//       try {
//         await deleteResume(resumeId).unwrap();
//         refetch();
//         setFilenamePreview(null);
//         setCurrentSlide((prev) => Math.max(0, prev - 1));
//       } catch (error) {
//         console.error("Error deleting resume:", error);
//       }
//     }
//   };

//   const handleNextSlide = () => {
//     if (getResume?.data && currentSlide < getResume.data.length - 1) {
//       setCurrentSlide(currentSlide + 1);
//       setFilenamePreview(null);
//     }
//   };

//   const handlePrevSlide = () => {
//     if (currentSlide > 0) {
//       setCurrentSlide(currentSlide - 1);
//       setFilenamePreview(null);
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
//       {/* Slide View Section */}
//       <h1 className="text-2xl font-bold text-center mb-4">Your Resumes</h1>
//       {isGetResumeLoading ? (
//         <p className="text-center text-gray-500">Loading resumes...</p>
//       ) : getResume?.data?.length > 0 ? (
//         <div className="relative">
//           {/* Slide Container */}
//           <div className="overflow-hidden">
//             <div
//               className="flex transition-transform duration-300"
//               style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//             >
//               {getResume.data.map((resume) => (
//                 <div key={resume.id} className="min-w-full p-4">
//                   <div className="border rounded-lg p-4 bg-gray-50">
//                     {/* Resume Info */}
//                     <div className="flex justify-between items-center mb-2">
//                       <div>
//                         <h2 className="text-lg font-semibold">{resume.file_name}</h2>
//                         <p className="text-sm text-gray-500">{resume.uploaded_at}</p>
//                       </div>
//                     </div>
//                     {/* Action Buttons */}
//                     <div className="flex gap-2 mb-4">
//                       <button
//                         onClick={() => setFilenamePreview(resume.file_name)}
//                         className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
//                       >
//                         Preview
//                       </button>
//                       <a
//                         href={`/api/user/resume/download/${resume.file_name}`}
//                         download={resume.file_name}
//                         className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//                       >
//                         Download
//                       </a>
//                       <button
//                         onClick={() => handleDelete(resume.id)}
//                         disabled={isDeleting}
//                         className={`px-3 py-1 text-white rounded text-sm ${
//                           isDeleting
//                             ? "bg-red-300 cursor-not-allowed"
//                             : "bg-red-500 hover:bg-red-600"
//                         }`}
//                       >
//                         {isDeleting ? "Deleting..." : "Delete"}
//                       </button>
//                     </div>
//                     {/* Preview Section */}
//                     {filenamePreview === resume.file_name && (
//                       <div className="mt-4">
//                         {isFileURLLoading ? (
//                           <p className="text-center text-gray-500">Loading preview...</p>
//                         ) : (
//                           <div className="max-h-96 overflow-auto">
//                             <Document
//                               file={fileURL}
//                               onLoadError={(error) => console.error("PDF load error:", error)}
//                             >
//                               <Page pageNumber={1} width={500} />
//                             </Document>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           {/* Navigation Buttons */}
//           {getResume.data.length > 1 && (
//             <div className="flex justify-between mt-4">
//               <button
//                 onClick={handlePrevSlide}
//                 disabled={currentSlide === 0}
//                 className={`px-3 py-1 rounded text-sm ${
//                   currentSlide === 0
//                     ? "bg-gray-300 cursor-not-allowed"
//                     : "bg-blue-500 text-white hover:bg-blue-600"
//                 }`}
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={handleNextSlide}
//                 disabled={currentSlide === getResume.data.length - 1}
//                 className={`px-3 py-1 rounded text-sm ${
//                   currentSlide === getResume.data.length - 1
//                     ? "bg-gray-300 cursor-not-allowed"
//                     : "bg-blue-500 text-white hover:bg-blue-600"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">No resumes uploaded yet.</p>
//       )}

//       {/* Upload Section */}
//       <div className="mt-6 border-t pt-4">
//         <h2 className="text-xl font-semibold text-center mb-3">Upload New Resume</h2>
//         <div className="flex flex-col items-center gap-3">
//           <input
//             type="file"
//             id="resume"
//             onChange={handleFileChange}
//             accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//             className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-green-500 file:text-white file:hover:bg-green-600"
//           />
//           <button
//             onClick={handleUpload}
//             disabled={isFileLoading || !resumeFile}
//             className={`px-4 py-2 rounded text-sm text-white ${
//               isFileLoading || !resumeFile
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-green-500 hover:bg-green-600"
//             }`}
//           >
//             {isFileLoading ? "Uploading..." : "Upload Resume"}
//           </button>
//           {resumeFile && (
//             <p className="text-sm text-gray-600">
//               Selected file: {resumeFile.name} (
//               {(resumeFile.size / 1024).toFixed(2)} KB)
//             </p>
//           )}
//           {isFileSuccess && (
//             <p className="text-green-500 text-sm">Resume uploaded successfully!</p>
//           )}
//           {errorFile && (
//             <p className="text-red-500 text-sm">
//               Error: {errorFile.data?.message || "Upload failed"}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Resume;
