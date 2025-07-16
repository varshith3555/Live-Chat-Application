import ReactMarkdown from 'react-markdown';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function isImageUrl(url) {
  return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
}

const Message = ({ message, chat }) => {
  const { user } = useContext(AuthContext);
  const isOwnMessage = message.sender._id === user?._id;
  const allSeen = message.seenBy && chat && message.seenBy.length === chat.members.length;

  return (
    <div className={`flex items-start mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        message.sender.avatar && message.sender.avatar.trim() !== '' ? (
          <img 
            src={message.sender.avatar} 
            alt="avatar" 
            width={32} 
            height={32}
            className="rounded-full mr-2 flex-shrink-0 bg-gray-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full mr-2 flex-shrink-0 bg-gray-200 flex items-center justify-center font-bold text-base text-midnight">
            {message.sender.name?.[0]?.toUpperCase() || '?'}
          </div>
        )
      )}
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-first' : ''}`}>
        {!isOwnMessage && (
          <div className="text-xs text-gray-500 mb-1">{message.sender.name}</div>
        )}
        <div className={`p-3 rounded-lg ${
          isOwnMessage 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-800'
        }`}>
          <div className={`prose ${isOwnMessage ? 'prose-invert' : ''} max-w-none`}>
            {isImageUrl(message.content) ? (
              <img src={message.content} alt="sent" className="rounded max-h-60" />
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <span>{children}</span>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => <code className="bg-gray-700 text-white px-1 rounded text-sm">{children}</code>
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {allSeen && (
            <span className="text-xs text-green-500 ml-2">✓ Seen by all</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message; 