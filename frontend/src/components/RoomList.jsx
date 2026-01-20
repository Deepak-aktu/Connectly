import { useEffect, useState } from "react"; // Add useState
import { useChatStore } from "../store/useChatStore";
import { Users } from "lucide-react";

import CreateGroupModal from "./CreateGroupModal"; // Import the modal

const RoomList = () => {
  const { getMyRooms, rooms, setSelectedRoom, selectedRoom, isUsersLoading, getAllContacts } = useChatStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getMyRooms();
    getAllContacts(); // Load contacts so we can add them to groups
  }, [getMyRooms, getAllContacts]);



  return (
    <>
      <div className="space-y-1">
        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Your Groups
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <Users className="mx-auto size-8 opacity-20 mb-2" />
            <p className="text-sm">No groups found</p>
          </div>
        ) : (
          rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => setSelectedRoom(room)}
              className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all ${
                selectedRoom?._id === room._id ? "bg-slate-800 ring-1 ring-white/10" : "hover:bg-slate-800/50"
              }`}
            >
              <div className="size-12 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-500/20 text-cyan-400 font-bold">
                {room.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <h3 className="font-medium text-slate-200 truncate">{room.name}</h3>
                <p className="text-xs text-slate-500">{room.members?.length || 0} members</p>
              </div>
            </button>
          ))
        )}

        <div className="p-2">
          <button
            onClick={() => setIsModalOpen(true)} // Open modal here!
            className="w-full py-2 px-4 rounded-lg border border-dashed border-white/10 text-slate-400 text-sm hover:border-white/20 hover:text-white transition-all"
          >
            + Create New Group
          </button>
        </div>
      </div>

      {/* Modal Component */}
      <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default RoomList;