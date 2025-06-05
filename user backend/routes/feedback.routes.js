const express = require('express');
const router = express.Router();
const {submitFeedback, getAllFeedbacks, deleteFeedback} = require('../controllers/feedback.controllers');

router.post('/submit', submitFeedback);
router.get("/getAllFeedbacks", getAllFeedbacks);
router.get("/getAllFeedbacks/:feedbackId", getAllFeedbacks);
// router.delete("/deleteFeedback", deleteFeedback);

module.exports = router;