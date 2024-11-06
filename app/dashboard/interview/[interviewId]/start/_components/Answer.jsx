"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic } from "lucide-react";
import useSpeechToText from "react-hook-speech-to-text";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import Webcam from "react-webcam";
import Link from "next/link";

function Answer({
  handleAnswer,
  handleInterimAnswer,
  inQuestion,
  activeQue,
  interviewId,
  interId,
}) {
  const { user } = useUser();
  const [userAnswer, setUserAnswer] = useState("");
  const [load, setLoad] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    const latestResult = results[results.length - 1];
    if (latestResult?.transcript) {
      handleAnswer(latestResult.transcript);
    }
  }, [results.length, handleAnswer]);

  useEffect(() => {
    if (interimResult) {
      handleInterimAnswer(interimResult);
    }
  }, [interimResult, handleInterimAnswer]);

  const saveUserAnswer = async () => {
    if (userAnswer.length < 5) {
      toast("Your answer is too short, please try again.");
      return;
    }

    setLoad(true);
    const feedbackPrompt = `Question: ${inQuestion?.[activeQue]?.question}, User Answer: ${userAnswer}. Depends on question and user answer please give us rating for answer out of 10 and feedback as area of improvment if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const finalResult = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      const jsonFeedbackResp = JSON.parse(finalResult);

      const response = await fetch("/api/addanswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: interId,
          question: inQuestion?.[activeQue]?.question,
          correctAnswer: inQuestion?.[activeQue]?.answer,
          userAnswer: userAnswer,
          feedback: jsonFeedbackResp?.feedback,
          rating: jsonFeedbackResp?.rating,
          userEmail:
            user?.primaryEmailAddress?.emailAddress || "demo@gmail.com",
          createdAt: moment().format("DD-MM-YYYY"),
        }),
      });

      if (response.ok) {
        toast(
          "Your answer has been recorded successfully. You may proceed to the next question."
        );
        setUserAnswer("");
      } else {
        // toast("An error occurred while saving your answer. Please try again.");
        console.error("Failed to save answer, status:", response.status);
      }
    } catch (err) {
      toast("Your answer was not recorded, please try again.");
      console.error("An error occurred:", err);
    } finally {
      setResults([]);
      setLoad(false);
    }
  };

  const handleOnEnd = () => {
    toast("We are preparing your interview feedback, please wait a moment...");
  }

  return (
    <div>
      <div className="bg-gray-400">
        <Webcam mirrored />
        <Button
          className={`w-full ${
            isRecording ? "text-red-600 bg-black" : "text-white"
          }`}
          onClick={isRecording ? stopSpeechToText : startSpeechToText}
        >
          {isRecording ? (
            <div className="flex gap-2">
              <Mic />
              <p>Stop Recording...</p>
            </div>
          ) : (
            "Start Recording"
          )}
        </Button>
        {error && <p>Error with microphone. Please ensure it's enabled.</p>}
      </div>

      <div className="flex justify-between mt-3">
        {
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={saveUserAnswer}
          >
            {load ? <Loader2 className="animate-spin" /> : "Save Answer"}
          </Button>
        }
        <Link href={`/dashboard/interview/${interviewId}/feedback`}>
          <Button className="bg-red-500 hover:bg-red-600" onClick={handleOnEnd}>End Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Answer;
