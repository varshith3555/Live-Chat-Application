import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { content, chatId } = req.body;
    
    if (!content || !chatId) {
      return res.status(400).json({ message: 'Content and chat ID are required' });
    }
    
    // Verify user is a member of the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (!chat.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not a member of this chat' });
    }
    
    const message = await Message.create({ 
      sender: req.user._id, 
      content, 
      chat: chatId 
    });
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');
    
    // Update chat's latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    
    // Verify user is a member of the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (!chat.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not a member of this chat' });
    }
    
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const markAsSeen = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    
    // Verify user is a member of the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (!chat.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not a member of this chat' });
    }
    
    await Message.updateMany(
      { chat: chatId, seenBy: { $ne: req.user._id } },
      { $addToSet: { seenBy: req.user._id } }
    );
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}; 