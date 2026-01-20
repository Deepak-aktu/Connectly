import { Navigate, Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PageLoader from "./components/PageLoader";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  // We determine if we are on an "Auth" page (Login/Signup) 
  // to apply specific layout rules if needed.
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 ">
      
    
      {/* 2. Professional Glow Orbs */}
   
      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 w-full min-h-screen flex flex-col">
        <Routes>
          <Route 
            path="/" 
            element={authUser ? <ChatPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!authUser ? <LoginPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/signup" 
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />} 
          />
          {/* Catch all - 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* CUSTOMIZED TOASTER */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e293b', // slate-800
            color: '#f8fafc',    // slate-50
            border: '1px solid #334155', // slate-700
          },
          success: {
            iconTheme: {
              primary: '#818cf8', // indigo-400
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;