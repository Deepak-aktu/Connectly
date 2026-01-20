import { XIcon, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser, selectedRoom, setSelectedRoom } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // Helper to close the chat (works for both user and room)
  const handleClose = () => {
    setSelectedUser(null);
    setSelectedRoom(null);
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);

  // Determine what to display
  const displayTitle = selectedUser ? selectedUser.fullName : selectedRoom?.name;
  const displayPic = selectedUser?.profilePic;
  const isOnline = selectedUser ? onlineUsers.includes(selectedUser._id) : false;
  const subText = selectedUser 
    ? (isOnline ? "Online" : "Offline") 
    : `${selectedRoom?.members?.length || 0} members`;

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 min-h-[84px] px-6">
      <div className="flex items-center space-x-3">
        {/* Avatar Section */}
        <div className={`avatar ${selectedUser && isOnline ? "online" : ""}`}>
          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-slate-700 flex items-center justify-center">
            {displayPic ? (
              <img src={displayPic} alt={displayTitle} className="object-cover w-full h-full" />
            ) : selectedRoom ? (
              // Show Room Initials if it's a group
              <span className="text-cyan-400 font-bold text-lg">
                {selectedRoom.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <img src="/avatar.png" alt="avatar" />
            )}
          </div>
        </div>

        {/* Info Section */}
        <div>
          <h3 className="text-slate-200 font-medium flex items-center gap-2">
            {displayTitle}
            {selectedRoom && <Users className="size-3 text-slate-500" />}
          </h3>
          <p className={`text-sm ${isOnline ? "text-cyan-400" : "text-slate-400"}`}>
            {subText}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <button 
        onClick={handleClose}
        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
      >
        <XIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-200 cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;