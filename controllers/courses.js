const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getCourses = asyncHandler(async (request, response, next) => {
    let query;
    
    if(request.params.bootcampId) {
        query = Course.find({ bootcamp: request.params.bootcampId });
    }
    else {
        query = Course.find();
    }

    const courses = await query;

    response.status(200).json({ success: true, count: courses.length, data: courses });
});