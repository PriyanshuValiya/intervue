"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Questions({ inQuestion, activeQue, setActiveQue, answer, interimAnswer }) {

  const handleTextToSpeech = (text) => {
    if("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    } else {
        alert("Sorry, Your Browser Does't Support Text To Speech");
    }
  };

  return (
    <div>
      <div className="p-5 border-b-2 rounded-lg">
        <div className="flex flex-wrap gap-4">
          {inQuestion &&
            inQuestion.map((question, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`${
                  activeQue === index ? "bg-blue-500 text-white" : ""
                }hover:bg-gray-500 hover:text-white`}
              >
                Question: {index + 1}
              </Badge>
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-y-5 h-64 mt-10 pl-3 pr-7 text-xl">
        <div>
          <h2>
            {inQuestion?.[activeQue]?.question || "No question available"}
          </h2>
          <Volume2 className="mt-3 cursor-pointer" onClick={() => handleTextToSpeech(inQuestion?.[activeQue]?.question)} />
        </div>
        <div className="text-lg flex gap-x-2">
          <p>Answer:</p>
          <p className="w-full h-40">
            {interimAnswer || answer || "No answer provided"}
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-x-3 mt-3 pr-8">
        {activeQue>0 && <Button onClick={() => setActiveQue(activeQue-1)}>Back</Button>}
        {activeQue!=inQuestion?.length-1 && <Button className="" onClick={() => setActiveQue(activeQue+1)}>Next</Button>}
      </div>
    </div>
  );
}

export default Questions;
