
const express = require('express');
const router = express.Router();
const {submituserFeedback,getFeedback} = require('../controllers/feedback.controllers');

router.post('/submit',submituserFeedback);

// router.get('/get',getFeedback);


module.exports = router;