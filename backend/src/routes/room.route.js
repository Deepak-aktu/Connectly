import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRoom, getUserRooms, getRoomMessages, sendRoomMessage } from "../controllers/room.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/create", createRoom);
router.get("/my-rooms", getUserRooms);
router.get("/messages/:roomId", getRoomMessages);
router.post("/send/:roomId", sendRoomMessage);

export default router;