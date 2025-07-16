import { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';

const ChatList = ({ onSelectChat, onNewChat, onlineUsers = [] }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await API.get('/chats');
        setChats(response.data);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user]);

  if (!user) {
    return <div className="text-center text-gray-500">Please login to view chats</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Your Chats</h3>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition"
          onClick={onNewChat}
        >
          + New Chat
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading chats...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : chats.length === 0 ? (
        <div className="text-center text-gray-500 mt-4">No chats yet</div>
      ) : (
        <ul className="space-y-2 overflow-y-auto flex-1 pr-1">
          {chats.map(chat => {
            const otherUser = chat.members.find(m => m._id !== user._id);
            const isOnline = otherUser && onlineUsers.includes(otherUser._id);
            return (
              <li
                key={chat._id}
                className="flex items-center gap-3 cursor-pointer bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-3 shadow-sm transition"
                onClick={() => onSelectChat(chat)}
              >
                <div className="relative">
                  {otherUser?.avatar && otherUser.avatar.trim() !== '' ? (
                    <img
                      src={otherUser.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border bg-gray-200"
                      onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border bg-gray-200 flex items-center justify-center font-bold text-lg text-midnight">
                      {otherUser?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate flex items-center gap-2">
                    {chat.isGroupChat ? chat.chatName : (otherUser?.name || 'Unknown User')}
                    {isOnline && <span className="text-xs text-green-600 font-semibold">Online</span>}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {isOnline
                      ? ''
                      : otherUser?.lastSeen
                        ? `Last seen: ${new Date(otherUser.lastSeen).toLocaleString()}`
                        : 'Last seen: N/A'}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChatList; 