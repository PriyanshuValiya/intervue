"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Questions from "./_components/Questions";
import Answer from "./_components/Answer";

function InterviewGround({ params }) {
  const { interviewId } = React.use(params);
  const [interviewData, setInterviewData] = useState({});
  const [inQuestion, setInQuestion] = useState();
  const [activeQue, setActiveQue] = useState(0);
  const [answer, setAnswer] = useState("");
  const [interimAnswer, setInterimAnswer] = useState("");
  const [interId, setInterId] = useState("");

  const handleAnswer = (data) => {
    setAnswer(data); 
  };

  const handleInterimAnswer = (data) => {
    setInterimAnswer(data); 
  };

  useEffect(() => {
    if (interviewId) {
      getInterviewDetails();
    } else {
      console.error("Interview ID is not provided");
    }
  }, [interviewId]);

  const getInterviewDetails = async () => {
    try {
      const response = await fetch(`/api/getdetails/${interviewId}`);
      if (response.ok) {
        const data = await response.json();
        setInterviewData(data);
        // console.log(data);
        setInQuestion(data.jsonMockResp);
        setInterId(data._id);
      } else {
        console.error("Failed to fetch data, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="flex gap-x-3 mt-10">
      <div className="w-8/12">
        {inQuestion && (
          <Questions
            inQuestion={inQuestion}
            activeQue={activeQue}
            setActiveQue={setActiveQue}
            answer={answer}
            interimAnswer={interimAnswer} 
          />
        )}
      </div>
      <div className="4/12">
        <Answer
          handleAnswer={handleAnswer}
          handleInterimAnswer={handleInterimAnswer}
          inQuestion={inQuestion}
          activeQue={activeQue}
          interviewId={interviewId}
          interId={interId}
        />
      </div>
    </div>
  );
}

export default InterviewGround;
