const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const { requireAdminAuth } = require('../middleware/auth');

const router = express.Router();

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Login Route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check against Environment Variables
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        // Create JWT Token
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set token in an HTTP-only cookie (secure against XSS)
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.status(200).json({ message: 'Logged out successfully' });
});

// ==========================================
// PROTECTED DASHBOARD ROUTES
// ==========================================

// Get all messages
router.get('/messages', requireAdminAuth, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }); // Newest first
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Toggle Read Status
router.patch('/messages/:id/read', requireAdminAuth, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ error: 'Message not found' });

        message.read = !message.read;
        await message.save();

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Delete Message
router.delete('/messages/:id', requireAdminAuth, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;