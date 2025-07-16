import { useState, useRef } from 'react';
import API from '../api/api';
import socket from '../utils/socket';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import toast from 'react-hot-toast';

const MessageInput = ({ chatId }) => {
  const [content, setContent] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef();

  const sendMessage = async (e, fileUrl = null) => {
    e && e.preventDefault();
    if ((!content.trim() && !fileUrl) || sending) return;
    try {
      setSending(true);
      const { data } = await API.post('/messages', { content: fileUrl ? fileUrl : content, chatId });
      socket.emit('sendMessage', { chatId, message: data });
      setContent('');
      socket.emit('stopTyping', chatId);
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    socket.emit('typing', chatId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    } else {
      handleTyping();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      toast.loading('Uploading image...');
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.dismiss();
      toast.success('Image uploaded!');
      sendMessage(null, res.data.url);
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to upload image.');
    }
  };

  return (
    <form onSubmit={sendMessage} className="flex items-center p-2 border-t relative">
      <input
        className="flex-1 border rounded p-2"
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={sending}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={handleAttachClick}
        className="mx-2 p-2 hover:bg-gray-100 rounded"
        disabled={sending}
        title="Attach image"
      >
        <span role="img" aria-label="attach">📎</span>
      </button>
      <button 
        type="button" 
        onClick={() => setShowPicker(!showPicker)} 
        className="mx-2 p-2 hover:bg-gray-100 rounded"
        disabled={sending}
      >
        😊
      </button>
      {showPicker && (
        <div className="absolute bottom-16 right-4 z-10">
          <Picker onSelect={emoji => setContent(content + emoji.native)} />
        </div>
      )}
      <button 
        type="submit" 
        disabled={sending || (!content.trim() && !fileInputRef.current?.files?.length)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default MessageInput; 