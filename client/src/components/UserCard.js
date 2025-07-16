import React from 'react';

const UserCard = ({ user, onClick }) => (
  <div
    className={`flex items-center gap-3 p-3 mx-4 mb-2 rounded-lg cursor-pointer transition-all duration-300 bg-white/10 hover:bg-white/20 group ${
      user.isOnline ? 'animate-pulse-soft' : ''
    }`}
    onClick={onClick}
  >
    <div
      className={`w-12 h-12 rounded-full bg-gradient-to-tr from-neon to-silver flex items-center justify-center shadow-lg border-4 ${
        user.isOnline ? 'border-neon' : 'border-silver'
      } transition-all duration-300`}
    >
      <span className="text-midnight font-bold text-lg select-none">
        {user.name ? user.name[0] : '?'}
      </span>
    </div>
    <div className="flex flex-col">
      <span className="font-poppins font-semibold text-neon text-lg transition-all duration-300 group-hover:translate-x-2">
        {user.name}
      </span>
      <span className={`text-xs ${user.isOnline ? 'text-neon' : 'text-silver'}`}>
        {user.isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  </div>
);

export default UserCard; 