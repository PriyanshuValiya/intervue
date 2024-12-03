import connectDB from "@/lib/connectDB";
import Question from "@/lib/models/questionModel";

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
    const interviewDtl = await Question.findById(interviewId); 

    if (!interviewDtl) {
      return new Response(JSON.stringify({ error: "Interview not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(interviewDtl), {
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
