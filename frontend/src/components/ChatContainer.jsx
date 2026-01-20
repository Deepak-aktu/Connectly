import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    selectedRoom,
    getMessagesByUserId,
    getRoomMessages,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Load messages whenever selection changes
  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
    } else if (selectedRoom) {
      getRoomMessages(selectedRoom._id);
    }

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, selectedRoom, getMessagesByUserId, getRoomMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              // Determine if I am the sender
              // msg.senderId could be an object (populated) or just an ID string
              const senderId = msg.senderId?._id || msg.senderId;
              const isMyMessage = senderId === authUser._id;

              return (
                <div
                  key={msg._id}
                  className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
                >
                  {/* For Group Chats: Show sender's name if it's not my message */}
                  {!isMyMessage && selectedRoom && (
                    <div className="chat-header mb-1 text-xs opacity-50 ml-1">
                      {msg.senderId?.fullName || "User"}
                    </div>
                  )}

                  <div
                    className={`chat-bubble relative ${
                      isMyMessage
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    {msg.image && (
                      <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                    )}
                    {msg.text && <p className="mt-2">{msg.text}</p>}
                    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            {/* Scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName || selectedRoom?.name} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;