import connectDB from "@/lib/connectDB"; 
import Question from "@/lib/models/questionModel";
import moment from "moment";

export async function POST(request) {
  await connectDB(); 

  const { formData, jsonResponse, user } = await request.json();

  if (!Array.isArray(jsonResponse) || jsonResponse.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid jsonResponse format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const newQuestion = new Question({
    jsonMockResp: jsonResponse,
    jobPosition: formData.jobPosition,
    jobDesc: formData.jobDesc,
    jobExperience: formData.jobExperience,
    createdBy: user?.primaryEmailAddress?.emailAddress || "demo@gmail.com",
    createdAt: moment().format("DD-MM-YYYY"),
  });

  try {
    const savedDocument = await newQuestion.save();
    return new Response(JSON.stringify({ id: savedDocument._id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving data:", error);
    return new Response(JSON.stringify({ error: "Failed to save data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
