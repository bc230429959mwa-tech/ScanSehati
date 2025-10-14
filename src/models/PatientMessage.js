import mongoose, { Schema, model, models } from "mongoose";

const messageSchema = new Schema(
  {
    patientUsername: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorUsername: { type: String, required: true },
    doctorName: { type: String, required: true },
    content: { type: String, required: true },
    reply: { type: String },
    status: { type: String, enum: ["Unread", "Replied"], default: "Unread" },
  },
  { timestamps: true }
);

const Message = models.Message || model("Message", messageSchema);
export default Message;
