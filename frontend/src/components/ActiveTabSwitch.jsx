import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed bg-slate-900/50 p-1 border border-white/5 flex gap-1">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === "chats" 
            ? "bg-cyan-500/20 text-cyan-400 shadow-sm" 
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        }`}
      >
        Chats
      </button>

      {/* NEW: Groups Tab Button */}
      <button
        onClick={() => setActiveTab("groups")}
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === "groups" 
            ? "bg-cyan-500/20 text-cyan-400 shadow-sm" 
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        }`}
      >
        Groups
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === "contacts" 
            ? "bg-cyan-500/20 text-cyan-400 shadow-sm" 
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        }`}
      >
        Connect
      </button>
    </div>
  );
}

export default ActiveTabSwitch;