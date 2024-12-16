// src\components\ChatbotButton.tsx
"use client";

import React, { useContext, useState } from "react";
import ChatWindow from "./ChatWindow";
import { ThemeContext } from "@/app/context/ThemeContext";
import { MessageCircle, X } from "lucide-react";

const ChatBotButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className={`fixed bottom-32 right-6 flex items-center justify-center p-4 text-white rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 z-50 group ${
          isDarkMode
            ? "bg-gradient-to-br from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 focus:ring-purple-400"
            : "bg-gradient-to-br from-purple-500 to-purple-300 hover:from-purple-400 hover:to-purple-200 focus:ring-purple-200"
        }`}
      >
        <div className="relative flex items-center">
          {isChatOpen ? (
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          ) : (
            <>
              <MessageCircle 
                className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" 
              />
              <span className="text-sm font-semibold">AI</span>
            </>
          )}
        </div>
      </button>
      {isChatOpen && <ChatWindow onClose={toggleChat} />}
    </>
  );
};

export default ChatBotButton;