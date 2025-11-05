// schema for Message
import { Schema, model, models } from "mongoose";

const messageSchema = new Schema(
  {
    // Sender
    senderUsername: { type: String, required: true, index: true },
    senderName: { type: String, required: true },
    senderRole: {
      type: String,
      enum: ["doctor", "pharmacist", "patient"], // <-- NOTE: lowercase
      required: true,
    },

    // Recipient
    recipientUsername: { type: String, required: true, index: true },
    recipientName: { type: String, required: true },
    recipientRole: {
      type: String,
      enum: ["doctor", "pharmacist", "patient"], // <-- NOTE: lowercase
      required: true,
    },

    // Message
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["Unread", "Read"],
      default: "Unread",
    },
  },
  {
    timestamps: true,
  }
);

const Message = models.Message || model("Message", messageSchema);
export default Message;