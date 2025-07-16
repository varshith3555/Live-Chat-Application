import { useState, useContext, useEffect, useRef } from 'react';
import ChatList from '../components/ChatList';
import ChatScreen from '../components/ChatScreen';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import socket from '../utils/socket';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../components/ProfileModal';

const Dashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    if (user?._id) {
      socket.emit('setUserId', user._id);
    }
    socket.on('onlineUsers', setOnlineUsers);
    return () => {
      socket.off('onlineUsers', setOnlineUsers);
    };
  }, [user?._id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  const openNewChatModal = async () => {
    setShowModal(true);
    setLoadingUsers(true);
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const startChat = async (userToChat) => {
    setShowModal(false);
    try {
      const res = await API.post('/chats', { userId: userToChat._id });
      setSelectedChat(res.data);
    } catch {
      // handle error
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Light/Dark mode toggle
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    console.log('HTML classList:', document.documentElement.classList.value);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-poppins">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-indigo-800 via-60% to-cyan-400 animate-gradient-move transition-colors duration-500 dark:from-blue-950 dark:via-indigo-900 dark:to-blue-800" />
      {/* Glass overlay */}
      <div className="absolute inset-0 -z-10 bg-white/10 dark:bg-midnight/80 backdrop-blur-xl" />
      {/* Main content */}
      <div className="relative z-10 flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <div className="fixed md:static left-0 top-0 md:w-80 w-full h-full md:h-auto bg-white/10 dark:bg-midnight/60 backdrop-blur-lg shadow-xl rounded-2xl m-2 md:m-4 z-30 flex flex-col transition-all">
          <button className="mx-6 mt-6 mb-4 py-2 px-4 rounded-full border-2 border-neon text-neon font-semibold shadow hover:shadow-[0_0_16px_4px_#39ff14] hover:bg-neon hover:text-midnight transition" onClick={openNewChatModal}>
            + New Chat
          </button>
          <div className="flex-1 overflow-y-auto">
            <ChatList onSelectChat={setSelectedChat} onlineUsers={onlineUsers} />
          </div>
        </div>
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-midnight to-violet-900/30 dark:from-midnight dark:to-blue-900 p-2 md:p-8 rounded-2xl shadow-xl transition-all md:ml-80">
          {selectedChat ? (
            <ChatScreen chat={selectedChat} />
          ) : (
            <div className="flex flex-1 items-center justify-center animate-fade-in">
              <h2 className="text-xl md:text-3xl font-poppins text-silver/80 flex items-center text-center">
                Select a chat
                <span className="ml-2 w-2 h-8 bg-neon animate-blink rounded hidden md:inline-block"></span>
              </h2>
            </div>
          )}
        </div>
        {/* Profile Dropdown/Modal */}
        <div className="absolute top-4 right-4 md:right-8 z-50" ref={profileRef}>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-midnight/80 rounded-full shadow-lg hover:bg-white focus:outline-none transition"
            onClick={() => setShowProfile((v) => !v)}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-9 h-9 rounded-full border object-cover bg-gray-200"
                onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
              />
            ) : (
              <div className="w-9 h-9 rounded-full border bg-gray-200 flex items-center justify-center font-bold text-xl text-midnight">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <span className="font-medium text-midnight dark:text-white">{user?.name}</span>
            <svg className="w-4 h-4 ml-1 text-midnight dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-midnight rounded-lg shadow-lg py-2 border border-gray-100 max-w-xs w-full">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-midnight/60 text-midnight dark:text-white"
                onClick={() => { setShowProfile(false); setShowProfileModal(true); }}
              >
                Profile
              </button>
              <div className="px-4 py-2 text-midnight dark:text-white font-semibold border-b">{user?.name}</div>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-midnight/60 text-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {showProfileModal && (
          <ProfileModal
            user={user}
            onClose={() => setShowProfileModal(false)}
            onProfileUpdate={updated => setUser({ ...user, ...updated })}
          />
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-midnight rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Start a New Chat</h2>
              {loadingUsers ? (
                <div className="text-center text-gray-500">Loading users...</div>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {users.length === 0 && <li className="text-gray-500">No users found</li>}
                  {users.map(u => (
                    <li key={u._id} className="flex items-center gap-3 p-2 rounded hover:bg-blue-50 dark:hover:bg-midnight/60 cursor-pointer" onClick={() => startChat(u)}>
                      <img src={u.avatar || '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover border" onError={e => { e.target.src = '/default-avatar.png'; }} />
                      <div>
                        <div className="font-medium text-midnight dark:text-white">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button className="mt-6 w-full bg-gray-200 dark:bg-midnight/60 hover:bg-gray-300 dark:hover:bg-midnight text-gray-700 dark:text-white py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      {/* Light/Dark mode toggle button */}
      <button
        className="fixed top-4 left-4 z-50 bg-white/80 dark:bg-midnight/80 rounded-full p-2 shadow transition"
        onClick={toggleDarkMode}
        title="Toggle light/dark mode"
      >
        🌓
      </button>
    </div>
  );
};

export default Dashboard; 