import React from "react";
import {
  useGetProfileQuery,
  useGetResumeQuery,
  useGetSavedJobsQuery,
  useGetApplicationsQuery,
} from "../../redux/api/userApi";
import CreateProfileForm from "../../components/CreateProfileForm";

const UserProfile = () => {
  const { data: profile, isLoading: isProfileLoading } =
    useGetProfileQuery(null);

  // const { data: resume, isLoading: isResumeLoading } = useGetResumeQuery(null);

  // const { data: savedJobs, isLoading: isSavedJobLoading } =
  //   useGetSavedJobsQuery(null);

  // const { data: applications, isLoading: isApplicationsLoading } =
  //   useGetApplicationsQuery(null);

  if (isProfileLoading) return <p>GetJob Loading..</p>;
  // if (isSavedJobLoading) return <p>GetJobById Loading..</p>;
  // if (isApplicationsLoading) return <p>GetJobById Loading..</p>;
  // if (isResumeLoading) return <p>Resume Loading..</p>;

  // console.log(profile, savedJobs, applications, resume);
  return (
    <div>
      <h1>Profile Page and Form</h1>
      <p>{profile.data.first_name}</p>
      <p>{profile.data.last_name}</p>
      <p>{profile.data.phone}</p>
      <p>{profile.data.gender}</p>
      <p>{profile.data.date_of_birth}</p>
      <p>{profile.data.location}</p>
      <p>{profile.data.bio}</p>
      <p>{profile.data.updated_at}</p>
      <p>{profile.data.profile_image_url}</p>
      <p>{profile.data.cover_image_url}</p>
      <CreateProfileForm />
    </div>
  );
};

export default UserProfile;
