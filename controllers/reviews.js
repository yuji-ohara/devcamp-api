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

exports.updateReview = asyncHandler(async (request, response, next) => {
    request.body.user = request.user.id;

    let review = await Review.findById(request.params.id);

    if(!review) {
        return next(new ErrorResponse('Review not found', 404));
    }

    if(review.user.toString() !== request.user.id && request.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to update this review', 401));
    }

    review = await Review.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    });
    //await review.update(request.body);
    
    return response.status(200).json({ success: true, data: review });
});

exports.deleteReview = asyncHandler(async (request, response, next) => {
    const review = await Review.findById(request.params.id);

    if(!review) {
        return next(new ErrorResponse('Review not found', 404));
    }

    if(review.user.toString() !== request.user.id && request.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to update this review', 401));
    }

    await review.remove();
    
    return response.status(200).json({ success: true, data: `Review ${request.params.id} removed` });
});