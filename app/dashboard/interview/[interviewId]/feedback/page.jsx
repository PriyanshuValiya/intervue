"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Feedback({ params }) {
  const { interviewId } = useParams();
  const [feedbackData, setFeedbackData] = useState([]);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    const getInterviewDetails = async () => {
      try {
        const response = await fetch(`/api/getfeedback/${interviewId}`);

        if (response.ok) {
          const data = await response.json();
          setFeedbackData(data);
          calculateAverageRate(data);
        } else {
          console.error(
            "Failed to fetch feedback data, status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching feedback details:", error);
      }
    };

    getInterviewDetails();
  }, []);

  const calculateAverageRate = (data) => {
    let rate = 0;
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        rate += data[i].rating;
      }
      rate /= data.length;
    }
    setRate(rate.toFixed(1));
  };

  return (
    <div className="max-w-screen-xl p-9">
      <div>
        <h2
          className={`text-4xl font-semibold ${
            rate > 6 ? "text-green-600" : "text-red-600"
          }`}
        >
          {rate > 6 ? "Congratulations.." : "Need to improve.."}
        </h2>

        <h2 className="text-xl mt-8">
          Your Overall interview rating is : <strong>{rate}/10</strong>
        </h2>
        <h3 className="font-sm text-slate-800 mt-3">
          Find below interview question with its correct answer, Your answer,
          and feedback for improvement..
        </h3>
      </div>

      <div className="mt-4 rounded-lg">
        {feedbackData &&
          feedbackData.map((feedback, index) => (
            <div
              className={`border-2 border-black rounded-lg mt-5 p-1 ${
                feedback.rating > 3
                  ? feedback.rating > 7
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
              key={index}
            >
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger
                    className={`text-base ${
                      feedback.rating > 3
                        ? feedback.rating > 7
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {feedback.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <strong>Rating : {feedback.rating}</strong>
                  </AccordionContent>
                  <AccordionContent>
                    <strong>Your Answer : </strong>
                    {feedback.userAnswer}
                  </AccordionContent>
                  <AccordionContent>
                    <strong>Correct Answer : </strong>
                    {feedback.correctAnswer}
                  </AccordionContent>
                  <AccordionContent>
                    <strong>Feedback : </strong>
                    {feedback.feedback}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
      </div>

      <Link href={"/dashboard"}>
      <Button className="mt-9 float-right">Go Home</Button>
      </Link>
    </div>
  );
}

export default Feedback;
