require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const webhookRoutes = require('./routes/webhook.routes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// This is the endpoint UptimeRobot will hit
app.get('/ping', (req, res) => {
    console.log('Ping received! Keeping server awake.');
    res.status(200).send('Awake');
});

// Root health check
app.get('/', (req, res) => res.send('Digroz Webhook Server Live!'));

// Use Routes (This handles EVERYTHING now, cleanly linking to your controller)
app.use('/webhook', webhookRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));