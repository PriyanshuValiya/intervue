"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import * as React from "react";
import Webcam from "react-webcam";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

function InterviewID({ params }) {
  const { interviewId } = React.use(params);
  const router = useRouter();
  const [interviewData, setInterviewData] = useState({});
  const [webCam, setWebCam] = useState(false);
  const [load, setLoad] = useState(false);
  const { user } = useUser();
  const imgUrl =
    user?.imageUrl ||
    "https://www.tech101.in/wp-content/uploads/2018/07/blank-profile-picture.png";

  useEffect(() => {
    if (interviewId) {
      getInterviewDetails();
    } else {
      console.error("Interview ID is not provided");
    }
  }, [interviewId]);

  const getInterviewDetails = async () => {
    setLoad(true);
    try {
      const response = await fetch(`/api/getdetails/${interviewId}`);

      if (response.ok) {
        const data = await response.json();
        setInterviewData(data);
      } else {
        console.error("Failed to fetch data, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setLoad(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleStart = () => {
    router.push(`/dashboard/interview/${interviewId}/start`);
  };

  // useEffect(() => {console.log(interviewData)}, [interviewData]);

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex justify-around mt-16">
        <div className="h-6/12 w-6/12 pt-10 pl-7 ">
          <div>
            <h2 className="text-3xl font-semibold">Personal Info</h2>
            <div className="ml-2 mt-2 text-lg">
              <p>Name : {user?.fullName}</p>
              <p>Email : {user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <div className="mt-5">
            <h2 className="mt-2 text-3xl font-semibold">Interview Info</h2>
            <div className="ml-2 mt-2 text-lg">
              <p>Job Position : {interviewData.jobPosition}</p>
              <p>Description : {interviewData.jobDesc}</p>
              <p>Experience : {interviewData.jobExperience}</p>
            </div>
          </div>
        </div>
        <div>
          {webCam ? (
            <Webcam
              className="mt-5 h-96 w-96"
              onUserMedia={() => setWebCam(true)}
              onUserMediaError={() => setWebCam(false)}
              mirrored
            />
          ) : (
            <div className="flex flex-col justify-between h-96 w-96 mt-10">
              <img
                className="h-56 w-56 m-auto rounded-full"
                src={imgUrl}
                alt="profile photo"
              ></img>

              <Button onClick={() => setWebCam(true)}>
                Enable Web Camera and Microphone
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-20">
        <Button onClick={handleBack}>Back</Button>
        <Button onClick={handleStart}>{load ? <LoaderCircle className="animate-spin" /> : "Start"}</Button>
      </div>
    </div>
  );
}

export default InterviewID;
