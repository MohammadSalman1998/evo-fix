// src\components\ChatWindow.tsx
// "use client";

// import React from "react";
// import { useContext } from "react";
// import { AiOutlineClose } from "react-icons/ai";
// import { ThemeContext } from "@/app/context/ThemeContext";

// interface ChatWindowProps {
//   onClose: () => void;
// }

// const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
//   const { isDarkMode } = useContext(ThemeContext);

//   return (
//     <div
//       className={`fixed bottom-20 right-5 w-80 h-96 rounded-lg shadow-lg z-50
//         ${
//           isDarkMode
//             ? "bg-gray-700 text-white border-gray-600"
//             : "bg-gray-400 text-black"
//         }
//     `}
//     >
//       <div className="flex justify-between items-center p-4 border-b">
//         <h2 className="text-lg font-semibold">دردشة الذكاء الصناعي</h2>
//         <button onClick={onClose} className="text-gray-500 dark:text-gray-300">
//           <AiOutlineClose size={20} />
//         </button>
//       </div>
//       <div className="h-full">
//         <iframe
//           src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/11/29/17/20241129173014-8P65E5NZ.json"
//           title="AI Chatbot"
//           style={{ width: "100%", height: "100%", border: "none" }}
//         ></iframe>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;



"use client";

import React, { useState, useContext, useEffect } from "react";
import { AiOutlineClose, AiOutlineMessage } from "react-icons/ai";
import { ThemeContext } from "@/app/context/ThemeContext";

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initial screen size
    checkMobileView();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobileView);
    
    // Cleanup listener
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  return (
    <div 
      className={`
        fixed inset-0 sm:bottom-4 sm:right-4 sm:inset-auto 
        w-full sm:max-w-md sm:w-full z-50 
        transition-all duration-300 ease-in-out
        ${
          isDarkMode
            ? "bg-gray-900 text-white border-gray-700" 
            : "bg-white text-gray-800 border-gray-300"
        }
        ${isExpanded ? "h-full sm:h-[90vh]" : "h-16 sm:h-16"}
        ${isMobile && isExpanded ? "rounded-none" : "rounded-xl"}
        shadow-2xl border-2 overflow-hidden
      `}
      style={{
        maxHeight: isExpanded ? '100%' : '4rem'
      }}
    >
      {/* Header */}
      <div 
        className={`
          flex justify-between items-center p-4 cursor-pointer
          ${
            isDarkMode 
              ? "bg-gray-800/50 border-b border-gray-700" 
              : "bg-gray-100/50 border-b border-gray-200"
          }
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <AiOutlineMessage 
            className={`
              w-6 h-6 
              ${isDarkMode ? "text-blue-400" : "text-blue-600"}
            `} 
          />
          <h2 className="text-lg font-semibold">دردشة الذكاء الصناعي</h2>
        </div>
        <div className="flex items-center space-x-2">
          {isExpanded && isMobile && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }} 
              className="text-gray-500 mr-2"
            >
            </button>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className={`
              transition-all duration-200 hover:rotate-90 hover:text-red-500
              ${
                isDarkMode 
                  ? "text-gray-300 hover:text-red-400" 
                  : "text-gray-600 hover:text-red-600"
              }
            `}
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isExpanded && (
        <div className="h-[calc(100%-4rem)] p-2">
          <iframe
            src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/11/29/17/20241129173014-8P65E5NZ.json"
            title="AI Chatbot"
            className="w-full h-full rounded-lg border-none"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
