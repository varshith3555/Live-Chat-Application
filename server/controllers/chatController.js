import Chat from '../models/Chat.js';

export const createChat = async (req, res, next) => {
  try {
    const { userId, isGroupChat, chatName, members } = req.body;
    let chat;
    
    if (isGroupChat) {
      if (!chatName || !members || members.length < 2) {
        return res.status(400).json({ message: 'Group chat requires a name and at least 2 members' });
      }
      chat = await Chat.create({ chatName, isGroupChat, members });
    } else {
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required for individual chat' });
      }
      // Check if chat already exists
      const existingChat = await Chat.findOne({
        members: { $all: [req.user._id, userId] },
        isGroupChat: false
      });
      
      if (existingChat) {
        return res.json(existingChat);
      }
      
      chat = await Chat.create({ members: [req.user._id, userId] });
    }
    
    const populatedChat = await Chat.findById(chat._id).populate('members', '-password');
    res.status(201).json(populatedChat);
  } catch (error) {
    next(error);
  }
};

export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ members: req.user._id })
      .populate('members', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    next(error);
  }
}; 