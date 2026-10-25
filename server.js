const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middleware
app.use(cors({ 
    origin: ['http://localhost:3000', 'https://your-portfolio-name.netlify.app'], 
    credentials: true 
})); 
app.use(express.json());
app.use(cookieParser());

// Root endpoint health check
app.get('/', (req, res) => {
    res.status(200).send('Portfolio API Server is up and running');
});
// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Dashboard Database');
        app.listen(process.env.PORT, () => {
            console.log(`Admin Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => console.log('Database connection error:', error));