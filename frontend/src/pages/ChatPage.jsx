import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import RoomList from "../components/RoomList"; // Make sure to create this component
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  // Pull states from our updated store
  const { activeTab, selectedUser, selectedRoom, setSelectedUser, setSelectedRoom } = useChatStore();

  // Helper to check if any chat (private or group) is open
  const isAnyChatOpen = !!(selectedUser || selectedRoom);

  const handleBack = () => {
    setSelectedUser(null);
    setSelectedRoom(null);
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-slate-950 p-0 md:p-4 lg:p-8">
      
      <div className="relative w-full max-w-7xl h-full md:h-[85vh] shadow-2xl md:rounded-3xl overflow-hidden border border-white/5">
          
          <div className="flex h-full w-full bg-slate-900/40 backdrop-blur-xl">
            
            {/* --- SIDEBAR --- */}
            <aside className={`
              ${isAnyChatOpen ? "hidden" : "flex"} 
              md:flex w-full md:w-80 lg:w-96 flex-col border-r border-white/10 bg-slate-950/20
            `}>
              <div className="p-4 space-y-4">
                <ProfileHeader />
                {/* Ensure ActiveTabSwitch has a "groups" button */}
                <ActiveTabSwitch />
              </div>

              <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
                {activeTab === "chats" && <ChatsList />}
                {activeTab === "contacts" && <ContactList />}
                {activeTab === "groups" && <RoomList />}
              </div>
            </aside>

            {/* --- MAIN CHAT AREA --- */}
            <main className={`
              ${!isAnyChatOpen ? "hidden" : "flex"} 
              md:flex flex-1 flex-col bg-slate-900/10 relative
            `}>
              {isAnyChatOpen ? (
                <>
                  {/* Mobile Back Button */}
                  <div className="md:hidden absolute top-4 left-4 z-50">
                    <button 
                      onClick={handleBack}
                      className="p-2 rounded-full bg-slate-800 text-white shadow-lg border border-white/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                  </div>
                  
                  <ChatContainer />
                </>
              ) : (
                <NoConversationPlaceholder />
              )}
            </main>

          </div>
      
      </div>
    </div>
  );
}

export default ChatPage;