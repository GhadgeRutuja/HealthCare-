const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const mongoose = require('mongoose');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ success: false, message: 'Please provide receiver and content' });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content
    });

    // Populate sender details before emitting
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'firstName lastName profileImage role');

    // Emit socket event to receiver
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    if (io && userSockets) {
      const receiverSocketId = userSockets.get(receiverId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', populatedMessage);
      }
    }

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get conversation history with a specific user
// @route   GET /api/messages/:userId
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'firstName lastName profileImage role');

    // Mark received messages as read
    await Message.updateMany(
      { sender: userId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get list of recent contacts/conversations
// @route   GET /api/messages/conversations/list
// @access  Private
router.get('/conversations/list', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all unique users the current user has chatted with
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    }).sort({ createdAt: -1 });

    const contactMap = new Map();

    for (const msg of messages) {
      const isSender = msg.sender.toString() === currentUserId.toString();
      const contactId = isSender ? msg.receiver.toString() : msg.sender.toString();
      
      if (!contactMap.has(contactId)) {
        contactMap.set(contactId, {
          contactId,
          lastMessage: msg.content,
          timestamp: msg.createdAt,
          unreadCount: (!isSender && !msg.read) ? 1 : 0
        });
      } else {
        const existing = contactMap.get(contactId);
        if (!isSender && !msg.read) {
          existing.unreadCount += 1;
        }
      }
    }

    // Fetch user details for all contacts
    const contacts = Array.from(contactMap.values());
    const populatedContacts = await Promise.all(
      contacts.map(async (contact) => {
        const user = await User.findById(contact.contactId).select('firstName lastName profileImage role');
        return {
          ...contact,
          user
        };
      })
    );

    res.status(200).json({
      success: true,
      data: populatedContacts.filter(c => c.user) // Filter out deleted users
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
