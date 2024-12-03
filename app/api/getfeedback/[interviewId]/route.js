import connectDB from "@/lib/connectDB";
import Answer from "@/lib/models/answerModel";

export async function GET(request, { params }) {
  await connectDB();
  const { interviewId } = await params;

  if (!interviewId) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const feedbackDtl = await Answer.find({ questionId: interviewId });

    if (!feedbackDtl) {
      return new Response(JSON.stringify({ error: "Feedback not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(feedbackDtl), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
