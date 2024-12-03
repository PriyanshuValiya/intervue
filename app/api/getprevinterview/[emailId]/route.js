import connectDB from "@/lib/connectDB";
import Question from "@/lib/models/questionModel";

export async function GET(request, { params }) {
  await connectDB();
  const { emailId } = await params;

  try {
    const prevInterview = await Question.find({ createdBy: emailId });

    if (!prevInterview) {
      return new Response(JSON.stringify({ error: "Feedback not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(prevInterview), {
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
