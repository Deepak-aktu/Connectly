import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X, Users } from "lucide-react";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const { allContacts, createRoom } = useChatStore();
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  if (!isOpen) return null;

  const toggleMember = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || selectedMembers.length === 0) return;
    
    const success = await createRoom({
      name: groupName,
      members: selectedMembers,
    });

    if (success) {
      setGroupName("");
      setSelectedMembers([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Create New Group</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full">
            <X className="size-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium uppercase mb-1 block">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Work Team"
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium uppercase mb-1 block">
              Select Members ({selectedMembers.length})
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1 bg-slate-950 rounded-lg p-2 border border-white/10 scrollbar-thin">
              {allContacts.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleMember(user._id)}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                    selectedMembers.includes(user._id) ? "bg-cyan-500/20" : "hover:bg-white/5"
                  }`}
                >
                  <img src={user.profilePic || "/avatar.png"} className="size-8 rounded-full" alt="" />
                  <span className="text-sm text-slate-200 flex-1">{user.fullName}</span>
                  <input
                    type="checkbox"
                    readOnly
                    checked={selectedMembers.includes(user._id)}
                    className="checkbox checkbox-xs checkbox-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!groupName || selectedMembers.length === 0}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;