const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getReviews = asyncHandler(async (request, response, next) => {
    if (request.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: request.params.bootcampId });
        return response.status(200).json({ success: true, count: reviews.length, data: reviews });
    }
    else {
        response.status(200).json(response.advancedResults);
    }
});

exports.getReview = asyncHandler(async (request, response, next) => {
    const review = await Review.findById(request.params.id).populate({ path: 'bootcamp', select: 'name description' });
    
    if(!review) {
        return next(new ErrorResponse('Not found', 404));
    }
    
    return response.status(200).json({ success: true, data: review });
});

exports.createReview = asyncHandler(async (request, response, next) => {
    request.body.bootcamp = request.params.bootcampId;
    request.body.user = request.user.id;

    const bootcamp = await Bootcamp.findById(request.params.bootcampId);

    if(!bootcamp) {
        return next(new ErrorResponse('Bootcamp not found', 404));
    }

    const review = await Review.create(request.body);
    
    return response.status(200).json({ success: true, data: review });
});