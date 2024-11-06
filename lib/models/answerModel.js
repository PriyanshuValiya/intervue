import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true},
  question: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  userAnswer: { type: String, required: true },
  feedback: { type: String, required: true },
  rating: { type: Number, required: true },
  userEmail: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Answer = mongoose.models.Answer || mongoose.model("Answer", answerSchema);
export default Answer;
