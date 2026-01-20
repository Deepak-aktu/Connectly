import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Removed required: true because group messages don't have a single receiverId
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Added roomId to link messages to a specific group/room
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;