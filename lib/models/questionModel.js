import mongoose from "mongoose";

const questionModel = mongoose.Schema({
  jsonMockResp: {
    type: Array,
    require: true,
  },
  jobPosition: {
    type: String,
    require: true,
  },
  jobDesc: {
    type: String,
    require: true,
  },
  jobExperience: {
    type: Number,
    require: true,
  },
  createdBy: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
  },
});

const Question =
  mongoose.models.Question || mongoose.model("Question", questionModel);
export default Question;
