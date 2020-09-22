const express = require('express');
const {
    getReviews,
    getReview,
    createReview
} = require('../controllers/reviews');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');
const Review = require('../models/Review');

router.route('/')
    .get(advancedResults(Review, { path: 'bootcamp', select: 'name description' }), getReviews)
    .post(protect, authorize('user', 'admin'), createReview);

router.route('/:id')
    .get(getReview);

module.exports = router;