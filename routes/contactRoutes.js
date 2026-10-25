const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// POST /api/contact - Public route for the portfolio contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Create a new message in MongoDB using the Mongoose model
        const newMessage = new Message({
            name,
            email,
            subject,
            body: message // Map 'message' from frontend to 'body' in your schema
        });

        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to send message.' });
    }
});

module.exports = router;