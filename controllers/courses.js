const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getCourses = asyncHandler(async (request, response, next) => {
    if(request.params.bootcampId) {
        const courses = await Course.find({ bootcamp: request.params.bootcampId });
        return response.status(200).json({ success: true, count: courses.length, data: courses });
    }
    else {
        response.status(200).json(response.advancedResults);
    }
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
    request.body.user = request.user.id;
    
    const bootcamp = await Bootcamp.findById(request.params.bootcampId);

    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found id: ${request.params.bootcampId}`, 404));
    }

    if(bootcamp.user.id.toString() !== request.user.id && request.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${request.user.id} not authorized to create in this bootcamp ${bootcamp._id}`, 401));
    }

    const newCourse = await Course.create(request.body);

    response.status(200).json({ success: true, data: newCourse });
});

exports.updateCourse = asyncHandler(async (request, response, next) => {
    let course = await Course.findById(request.params.id);

    if(!course) {
        return next(new ErrorResponse(`Not found id: ${request.params.id}`, 404));
    }

    if(course.user.id.toString() !== request.user.id && request.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${request.user.id} not authorized to update course ${course._id}`, 401));
    }

    course = await Course.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    });

    response.status(200).json({ success: true, data: course });
});

exports.deleteCourse = asyncHandler(async (request, response, next) => {
    const course = await Course.findById(request.params.id, request.body, {
        new: true,
        runValidators: true
    });

    if(!course) {
        return next(new ErrorResponse(`Not found id: ${request.params.id}`, 404));
    }

    if(course.user.id.toString() !== request.user.id && request.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${request.user.id} not authorized to update course ${course._id}`, 401));
    }

    await course.remove();

    response.status(200).json({ success: true, data: `Course deleted id: ${request.params.id}` });
});