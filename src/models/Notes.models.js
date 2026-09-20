import mongoose from "mongoose";
import { Schema } from "mongoose";

/* creating Notes Schema*/
const NotesSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "the title is required"],
    },
    content: {
      type: String,
      required: [true, "The content description is required"],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Notes = mongoose.model("note", NotesSchema);

export default Notes;
