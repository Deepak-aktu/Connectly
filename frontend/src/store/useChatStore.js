import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  rooms: [], // Stores list of groups
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  selectedRoom: null, // Tracks currently open group
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    const newVal = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newVal);
    set({ isSoundEnabled: newVal });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  // When selecting a user, clear the room and leave socket room
  setSelectedUser: (selectedUser) => {
    const socket = useAuthStore.getState().socket;
    const currentRoom = get().selectedRoom;
    
    if (currentRoom && socket) socket.emit("leaveRoom", currentRoom._id);

    set({ selectedUser, selectedRoom: null });
  },

  // When selecting a room, join socket room and clear user
  setSelectedRoom: (selectedRoom) => {
    const socket = useAuthStore.getState().socket;
    const previousRoom = get().selectedRoom;

    // Socket Room Management
    if (socket) {
      if (previousRoom) socket.emit("leaveRoom", previousRoom._id);
      if (selectedRoom) socket.emit("joinRoom", selectedRoom._id);
    }
    
    set({ selectedRoom, selectedUser: null });
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch list of rooms the user is in
  getMyRooms: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/rooms/my-rooms");
      set({ rooms: res.data });
    } catch (error) {
      toast.error("Error loading groups");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // CREATE NEW GROUP ROOM
  createRoom: async (roomData) => {
    try {
      const res = await axiosInstance.post("/rooms/create", roomData);
      set({ rooms: [...get().rooms, res.data] });
      toast.success("Group created successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
      return null;
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Fetch messages for a specific room
  getRoomMessages: async (roomId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/rooms/messages/${roomId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error("Error loading group messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, selectedRoom, messages } = get();
    const { authUser } = useAuthStore.getState();

    const isGroup = !!selectedRoom;
    const targetId = isGroup ? selectedRoom._id : selectedUser._id;
    const url = isGroup ? `/rooms/send/${targetId}` : `/messages/send/${targetId}`;

    // Optimistic Update UI
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      ...(isGroup ? { roomId: targetId } : { receiverId: targetId }),
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(url, messageData);
      // Remove temp message and add real one from server
      set({ 
        messages: get().messages.filter(m => m._id !== tempId).concat(res.data) 
      });
    } catch (error) {
      // Rollback on failure
      set({ messages: get().messages.filter(m => m._id !== tempId) });
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // 1. Private Messages listener
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, isSoundEnabled, messages } = get();
      if (!selectedUser || newMessage.senderId !== selectedUser._id) return;

      set({ messages: [...messages, newMessage] });

      if (isSoundEnabled) {
        new Audio("/sounds/notification.mp3").play().catch(() => {});
      }
    });

    // 2. Group Messages listener
    socket.on("newRoomMessage", (newMessage) => {
      const { selectedRoom, isSoundEnabled, messages } = get();
      const { authUser } = useAuthStore.getState();

      // Don't add if we aren't looking at this room 
      if (!selectedRoom || newMessage.roomId !== selectedRoom._id) return;
      
      // Don't add if we sent it (optimistic UI already handled it)
      const senderId = newMessage.senderId?._id || newMessage.senderId;
      if (senderId === authUser._id) return;

      set({ messages: [...messages, newMessage] });

      if (isSoundEnabled) {
        new Audio("/sounds/notification.mp3").play().catch(() => {});
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("newRoomMessage");
    }
  },
}));