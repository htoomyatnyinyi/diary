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
              <div key={resume.id} className="bg-cyan-500 p-2 m-1">
                <div className="bg-sky-500 p-2 m-1">
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
//   useGetResumeQuery,
//   usePreviewResumeQuery,
//   useUploadResumeMutation,
// } from "../../redux/api/userApi";

// // Set workerSrc for react-pdf
// // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`; // import React, { useState } from "react";
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // // Set workerSrc for react-pdf
// // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
// //   "pdfjs-dist/build/pdf.worker.min.js",
// //   import.meta.url
// // ).toString();

// const Resume = () => {
//   const [resumeFile, setResumeFile] = useState();
//   const [filenamePreview, setFilenamePreview] = useState();
//   console.log(filenamePreview, "for fetching preview info");

//   const [
//     uploadResume,
//     { isLoading: isFileLoading, isSuccess: isFileSuccess, error: errorFile },
//   ] = useUploadResumeMutation();

//   const {
//     data: getResume,
//     isLoading: isGetResumeLoading,
//     refetch,
//   } = useGetResumeQuery(); // console.log(getResume, " resume ");

//   const {
//     data: previewResume,
//     isLoading: isPreviewResumeLoading,
//     error: isPreviewResumeError,
//   } = usePreviewResumeQuery(filenamePreview, { skip: !filenamePreview });

//   if (isPreviewResumeLoading) return <p>Loading ..</p>;
//   if (isPreviewResumeError) return <p>Error...</p>;
//   // console.log(previewResume, "data from backend ");

//   const handleFileChange = (e) => {
//     const file = e.target.files[0]; // setResumeFile(e.target.files[0]); // finished
//     if (file) {
//       setResumeFile(file);
//       console.log("Selected file:", file);
//     } else {
//       setResumeFile(null);
//       console.log("No file selected");
//     }
//   };

//   const handleUpload = async () => {
//     // console.log("File Upload", resumeFile);
//     if (!resumeFile || !resumeFile.name) {
//       console.log("No valid file selected for upload.");
//       // Optionally show a user message here
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", resumeFile);

//     try {
//       const result = await uploadResume(formData).unwrap();
//       refetch();
//       console.log("Upload success:", result);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   return (
//     <div className="p-4 border rounded">
//       <div>
//         <h1>Uploaded File</h1>
//         {isGetResumeLoading ? (
//           <p className="bg-red-500 h-96 w-full"> Get Resume Loading </p>
//         ) : (
//           <div>
//             {getResume?.data.map((resume) => (
//               <div key={resume.id} className="bg-cyan-500 p-2 m-1">
//                 <div className="bg-sky-500 p-2 m-1">
//                   <h1>{resume.file_name}</h1>
//                   <p>{resume.uploaded_at}</p>
//                   <button
//                     onClick={() => setFilenamePreview(resume.file_name)}
//                     className=" bg-green-500 p-2"
//                   >
//                     Click Preview
//                   </button>
//                 </div>
//                 <div className="max-h-screen max-w-10">
//                   <Document
//                     file={previewResume}
//                     onLoadError={(error) =>
//                       console.error("PDF load error:", error)
//                     }
//                   >
//                     <Page pageNumber={1} width={600} />
//                   </Document>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <div>
//         <h1 className="text-center text-3xl p-2  m-1">Resume Upload Page</h1>
//         <input
//           type="file"
//           id="resume"
//           onChange={handleFileChange}
//           // accept=".pdf,.doc,.docx,"
//           accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" // Helps user select correct files
//           className="bg-green-500 p-2 m-1"
//         />

//         <button
//           onClick={handleUpload}
//           // Disable if loading or if no file is selected
//           disabled={isFileLoading || !resumeFile}
//           className={`p-2 m-1  ${
//             isFileLoading || !resumeFile
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-green-500 hover:bg-green-600"
//           }`}
//         >
//           {isFileLoading ? "Uploading...." : "Upload Resume"}
//         </button>
//         {/* Display file info only if a file is selected */}
//         {resumeFile && (
//           <p className="underline mt-2">
//             Selected filesize: {(resumeFile.size / 1024).toFixed(2)} KB
//           </p>
//         )}
//       </div>
//       <div>
//         <div>
//           {isFileSuccess && (
//             <p className="text-green-500">Resume Uploaded Successfully!</p>
//           )}
//         </div>
//         <div>
//           {errorFile && (
//             <p className="text-red-500 mt-2">
//               Error: {errorFile.data?.message || "Upload failed"}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Resume;
