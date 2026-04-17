import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get public users for landing page (no auth required)
router.get('/users/discover', async (req, res) => {
  try {
    const { skill, search } = req.query;
    let query = { isPublic: true, isBanned: false, isAdmin: { $ne: true } };

    if (skill) {
      query.$or = [
        { skillsOffered: { $regex: skill, $options: 'i' } },
        { skillsWanted: { $regex: skill, $options: 'i' } }
      ];
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skillsOffered: { $regex: search, $options: 'i' } },
        { skillsWanted: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('name location skillsOffered skillsWanted availability rating totalRatings')
      .limit(20);

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    message: 'Skill Swap Platform API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default router; 