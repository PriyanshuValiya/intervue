"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

function Dashboard() {
  const { user } = useUser();

  return (
    <div className="p-10">
      <div>
        <h2 className="text-3xl font-bold">Hello, {user?.fullName}</h2>
        <h3 className="text-xl text-gray-800 mt-3">
          Create and Start Your Mock Interview...
        </h3>
      </div>

      <div className="my-10 grid grid-cols-1 md:grid-cols-3">
        <AddNewInterview />
      </div>

      <div className="my-10">
        <InterviewList />
      </div>
    </div>
  );
}

export default Dashboard;
