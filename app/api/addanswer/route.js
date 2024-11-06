import connectDB from "@/lib/connectDB";
import Answer from "@/lib/models/answerModel";
import moment from "moment";

export async function POST(request) {
  await connectDB();

  const {
    questionId,
    question,
    correctAnswer,
    userAnswer,
    feedback,
    rating,
    userEmail,
    createdAt,
  } = await request.json();

  const newAnswer = new Answer({
    questionId: questionId || "954321",
    question,
    correctAnswer,
    userAnswer,
    feedback,
    rating,
    userEmail,
    createdAt: createdAt || moment().toDate(),
  });

  try {
    await newAnswer.save();
    return new Response(
      JSON.stringify({ message: "Answer saved successfully!" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving data:", error);
    return new Response(JSON.stringify({ error: "Failed to save data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
