"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddNewInterview() {
  const { user } = useUser();
  const router = useRouter();

  const [dialogBox, setDialogBox] = useState(false);
  const [formData, setFormData] = useState({
    jobPosition: "",
    jobDesc: "",
    jobExperience: "",
  });
  const [interviewId, setInterviewId] = useState(null);
  const [load, setLoad] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      const prompt = `Job Position: ${formData.jobPosition}, Job Description: ${formData.jobDesc}, Years of experience: ${formData.jobExperience}. Provide 8 interview questions with answers in JSON format, with 'question' and 'answer' fields.`;
      const result = await chatSession.sendMessage(prompt);
      const finalResult = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");

      const parsedResponse = JSON.parse(finalResult);
      
      if (!Array.isArray(parsedResponse)) {
        throw new Error("Response format invalid. Expected an array.");
      }
      setJsonResponse(parsedResponse);

      const response = await fetch("/api/addinterview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          jsonResponse: parsedResponse,
          user,
        }),
      });

      if (response.ok) {
        toast("Please wait a moment..");
        const result = await response.json();
        setDialogBox(false);
        router.push(`/dashboard/interview/${result.id}`);
      } else {
        console.error("Error saving data");
      }
    } catch (err) {
      console.error("An error occurred:", err);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setDialogBox(true)}
      >
        <h2 className="text-lg font-semibold text-center">
          + Add New Interview
        </h2>
      </div>

      <Dialog open={dialogBox} onOpenChange={setDialogBox}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell Us About Your Dream Job
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleOnSubmit}>
                <div>
                  <p>
                    Add details about your job position/role, job description,
                    and experience...
                  </p>

                  <div className="flex flex-col gap-4 text-black my-7">
                    <div className="flex flex-col gap-1">
                      <label>Job Position / Role Name</label>
                      <Input
                        name="jobPosition"
                        value={formData.jobPosition}
                        placeholder="Full Stack Developer"
                        onChange={handleOnChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label>Job Description / Tech Stack</label>
                      <Textarea
                        name="jobDesc"
                        value={formData.jobDesc}
                        placeholder="React, Angular, MySQL, Node"
                        onChange={handleOnChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label>Experience</label>
                      <Input
                        name="jobExperience"
                        value={formData.jobExperience}
                        placeholder="3"
                        type="number"
                        onChange={handleOnChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-black"
                    onClick={() => setDialogBox(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {load ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
