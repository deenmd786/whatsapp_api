const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// GET request for Meta verification
router.get('/', webhookController.verifyWebhook);

// POST request for receiving messages
router.post('/', webhookController.handleWebhook);

module.exports = router;