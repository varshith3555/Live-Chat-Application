import { useEffect, useState, useRef } from 'react';
import API from '../api/api';
import socket from '../utils/socket';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatScreen = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await API.get(`/messages/${chat._id}`);
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    if (chat?._id) {
      fetchMessages();
      socket.emit('joinRoom', chat._id);
    }

    socket.on('receiveMessage', msg => setMessages(prev => [...prev, msg]));
    socket.on('typing', () => setTyping(true));
    socket.on('stopTyping', () => setTyping(false));

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [chat?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  if (!chat) {
    return <div className="flex items-center justify-center h-full text-gray-400">Select a chat</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading messages...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 p-3 border-b">
        <h3 className="font-semibold">
          {chat.isGroupChat ? chat.chatName : 'Chat'}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">No messages yet. Start the conversation!</div>
        ) : (
          messages.map(msg => <Message key={msg._id} message={msg} chat={chat} />)
        )}
        <div ref={messagesEndRef} />
        {typing && <TypingIndicator />}
      </div>
      <MessageInput chatId={chat._id} />
    </div>
  );
};

export default ChatScreen; 