import React from 'react';
import UserCard from './UserCard';

const users = [
  { id: '60d21b4667d0d8992e610c85', name: 'Varshith', isOnline: true },
  { id: '60d21b4967d0d8992e610c86', name: 'Reddy', isOnline: false },
  // Add more users as needed
];

const Sidebar = ({ onNewChat, onSelectUser }) => (
  <div className="fixed left-0 top-0 h-full w-72 bg-glass backdrop-blur-lg shadow-glass rounded-xl m-4 animate-slide-in z-20 flex flex-col">
    <button
      className="mx-6 mt-6 mb-4 py-2 px-4 rounded-full bg-midnight text-neon font-semibold shadow-lg transition-all duration-300 hover:shadow-[0_0_16px_4px_#39ff14] hover:bg-neon hover:text-midnight"
      onClick={onNewChat}
    >
      + New Chat
    </button>
    <div className="flex-1 overflow-y-auto">
      {users.map(user => (
        <UserCard key={user.id} user={user} onClick={() => onSelectUser(user)} />
      ))}
    </div>
  </div>
);

export default Sidebar; 