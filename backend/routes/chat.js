import express from 'express';
import { auth } from '../middleware/auth.js';
import { validateChatMessage } from '../middleware/validation.js';
import SwapRequest from '../models/SwapRequest.js';
import ChatMessage from '../models/ChatMessage.js';

const router = express.Router();

const getSwapForChat = async (swapRequestId, userId) => {
  const swapRequest = await SwapRequest.findById(swapRequestId)
    .populate('fromUser', 'name')
    .populate('toUser', 'name');

  if (!swapRequest) {
    return { error: { code: 404, message: 'Swap request not found' } };
  }

  const isParticipant =
    swapRequest.fromUser._id.toString() === userId.toString() ||
    swapRequest.toUser._id.toString() === userId.toString();

  if (!isParticipant) {
    return { error: { code: 403, message: 'Not authorized for this chat' } };
  }

  if (!['accepted', 'completed'].includes(swapRequest.status)) {
    return { error: { code: 400, message: 'Chat is available only after a request is accepted' } };
  }

  return { swapRequest };
};

router.get('/conversations', auth, async (req, res) => {
  try {
    const swapRequests = await SwapRequest.find({
      status: { $in: ['accepted', 'completed'] },
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }]
    })
      .populate('fromUser', 'name')
      .populate('toUser', 'name')
      .sort({ updatedAt: -1 });

    const conversations = await Promise.all(
      swapRequests.map(async (swapRequest) => {
        const latestMessage = await ChatMessage.findOne({ swapRequest: swapRequest._id })
          .sort({ createdAt: -1 })
          .select('message createdAt sender');

        const otherUser =
          swapRequest.fromUser._id.toString() === req.user._id.toString()
            ? swapRequest.toUser
            : swapRequest.fromUser;

        return {
          swapRequestId: swapRequest._id,
          otherUser,
          status: swapRequest.status,
          skillsOffered: swapRequest.skillsOffered,
          skillsRequested: swapRequest.skillsRequested,
          latestMessage
        };
      })
    );

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:swapRequestId/messages', auth, async (req, res) => {
  try {
    const { error, swapRequest } = await getSwapForChat(req.params.swapRequestId, req.user._id);
    if (error) {
      return res.status(error.code).json({ message: error.message });
    }

    const messages = await ChatMessage.find({ swapRequest: swapRequest._id })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    const otherUser =
      swapRequest.fromUser._id.toString() === req.user._id.toString()
        ? swapRequest.toUser
        : swapRequest.fromUser;

    res.json({
      messages,
      chatMeta: {
        swapRequestId: swapRequest._id,
        otherUser,
        status: swapRequest.status,
        skillsOffered: swapRequest.skillsOffered,
        skillsRequested: swapRequest.skillsRequested
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:swapRequestId/messages', auth, validateChatMessage, async (req, res) => {
  try {
    const { error, swapRequest } = await getSwapForChat(req.params.swapRequestId, req.user._id);
    if (error) {
      return res.status(error.code).json({ message: error.message });
    }

    const senderId = req.user._id.toString();
    const receiver =
      swapRequest.fromUser._id.toString() === senderId ? swapRequest.toUser._id : swapRequest.fromUser._id;

    const chatMessage = await ChatMessage.create({
      swapRequest: swapRequest._id,
      sender: req.user._id,
      receiver,
      message: req.body.message.trim()
    });

    const populatedMessage = await ChatMessage.findById(chatMessage._id).populate('sender', 'name');

    res.status(201).json({ message: 'Message sent', chatMessage: populatedMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
