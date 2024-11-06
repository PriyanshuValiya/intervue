import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function InterviewList() {
  const { user, isLoaded } = useUser();
  const [load, setLoad] = useState(false);
  const [prevIn, setPrevIn] = useState([]);

  useEffect(() => {
    if (isLoaded && user) {
      const prevInterviews = async () => {
        const emailId = user.primaryEmailAddress?.emailAddress;

        try {
          const response = await fetch(`/api/getprevinterview/${emailId}`);

          if (response.ok) {
            const data = await response.json();
            setPrevIn(data);
          } else {
            toast("Previous Interviews Can't Be Found!!");
          }
        } catch (err) {
          console.error("Error at fetch Data:", err);
        } finally {
          setLoad(false);
        }
      };

      setLoad(true);
      prevInterviews();
    }
  }, [isLoaded]);

  return (
    <div>
      <h2 className="text-xl font-semibold">Previous Mock Interviews</h2>
      {load ? (
        <div className="flex gap-x-4 pt-5 pl-3">
          <Skeleton className="h-40 w-96" />
          <Skeleton className="h-40 w-96" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-5 mt-5">
          {prevIn.map((ele, index) => (
            <Card
              className="hover:scale-105 hover:shadow-md transition-all"
              style={{ width: "370px" }}
              key={index}
            >
              <CardHeader>
                <CardTitle>{ele.jobPosition}</CardTitle>
                <CardDescription>
                  {ele.jobExperience} years of experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{ele.jobDesc}</p>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Link href={`/dashboard/interview/${ele._id}/feedback`}>
                    <Button variant="outline">Feedback</Button>
                  </Link>
                  <Link href={`/dashboard/interview/${ele._id}`}>
                    <Button>Start</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewList;
