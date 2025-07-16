import React from 'react';

const ChatArea = ({ selectedChat, children }) => (
  <div className="flex-1 flex flex-col md:ml-80 p-2 md:p-8 h-full min-h-screen bg-gradient-to-br from-midnight to-violet-900/30 rounded-2xl shadow-xl transition-all">
    {!selectedChat ? (
      <div className="flex flex-1 items-center justify-center animate-fade-in">
        <h2 className="text-xl md:text-3xl font-poppins text-silver/80 flex items-center text-center">
          Select a chat
          <span className="ml-2 w-2 h-8 bg-neon animate-blink rounded hidden md:inline-block"></span>
        </h2>
      </div>
    ) : (
      <div className="flex-1 flex flex-col animate-fade-in">
        <div className="flex-1 flex items-center justify-center text-silver/80 text-2xl">
          Chat with {selectedChat.name}
        </div>
        {children}
      </div>
    )}
  </div>
);

export default ChatArea; 