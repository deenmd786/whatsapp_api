require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const webhookRoutes = require('./routes/webhook.routes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Root health check
app.get('/', (req, res) => res.send('Digroz Webhook Server Live!'));

// Use Routes
app.use('/webhook', webhookRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));