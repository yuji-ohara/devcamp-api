const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getCourses = asyncHandler(async (request, response, next) => {
    let query;
    
    if(request.params.bootcampId) {
        query = Course.find({ bootcamp: request.params.bootcampId });
    }
    else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    response.status(200).json({ success: true, count: courses.length, data: courses });
});

exports.getCourse = asyncHandler(async (request, response, next) => {
    const course = await Course.findById(request.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!course) {
        return next(new ErrorResponse(`Not found id: ${request.params.id}`, 404));
    }

    response.status(200).json({ success: true, data: course });
});

exports.createCourse = asyncHandler(async (request, response, next) => {
    request.body.bootcamp = request.params.bootcampId;
    
    const bootcamp = await Bootcamp.findById(request.params.bootcampId);

    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found id: ${request.params.bootcampId}`, 404));
    }

    const newCourse = await Course.create(request.body);

    response.status(200).json({ success: true, data: newCourse });
});

exports.updateCourse = asyncHandler(async (request, response, next) => {
    const course = await Course.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    });

    if(!course) {
        return next(new ErrorResponse(`Not found id: ${request.params.id}`, 404));
    }

    response.status(200).json({ success: true, data: course });
});