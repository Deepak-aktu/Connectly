import Room from "../models/Room.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

export const createRoom = async (req, res) => {
  try {
    const { name, members } = req.body; // members: ["id1", "id2"]
    const creatorId = req.user._id;

    const newRoom = new Room({
      name,
      creatorId,
      members: [...members, creatorId], // include the creator
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserRooms = async (req, res) => {
  try {
    const userId = req.user._id;
    const rooms = await Room.find({ members: { $in: [userId] } });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).populate("senderId", "fullName profilePic");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendRoomMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { roomId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      roomId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Broadcast to everyone in the room
    io.to(roomId).emit("newRoomMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};