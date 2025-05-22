// routes/feedback.routes.js
const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const router = express.Router();

// POST /api/feedback - Create new feedback
router.post('/', feedbackController.createFeedback);

// GET /api/feedback - Get all feedback (admin route)
router.get('/', feedbackController.getAllFeedback);

// GET /api/feedback/:id - Get feedback by ID
router.get('/:id', feedbackController.getFeedbackById);

// DELETE /api/feedback/:id - Delete feedback
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;