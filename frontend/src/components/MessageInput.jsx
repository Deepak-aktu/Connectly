import { useState, useRef } from "react";
import { Send, Image, X, Smile } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import useKeyboardSound from "../hooks/useKeyboardSound";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isSoundEnabled } = useChatStore();
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (isSoundEnabled) playRandomKeyStrokeSound();
    await sendMessage({ text: text.trim(), image: imagePreview });
    
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) return toast.error("Please select an image");
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 bg-slate-900/50 border-t border-slate-800">
      {imagePreview && (
        <div className="mb-4 flex items-center gap-2">
          <div className="relative inline-block">
            <img src={imagePreview} className="size-20 object-cover rounded-xl border border-slate-700" />
            <button 
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 border border-slate-700 hover:bg-slate-800"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-3">
        <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center px-4 focus-within:border-cyan-500/50 transition-all">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-cyan-400">
            <Image size={20} />
          </button>
          <input
            type="text"
            placeholder="Write a message..."
            className="w-full bg-transparent border-none focus:ring-0 text-slate-200 py-3 px-3 text-sm"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (isSoundEnabled) playRandomKeyStrokeSound();
            }}
          />
          <input type="file" hidden ref={fileInputRef} onChange={handleImage} accept="image/*" />
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="size-11 flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;