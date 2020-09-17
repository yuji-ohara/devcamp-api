const path = require('path');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getBootcamps = asyncHandler(async (request, response, next) => {
    response.status(200).json(response.advancedResults);
});

exports.getBootcamp = asyncHandler(async (request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found ${request.params.id}`, 404));
    }

    response.status(200).json({ success: true, data: bootcamp });
});

exports.createBootcamp = asyncHandler(async (request, response, next) => {
    request.body.user = request.user.id;

    const publishedBootcamp = await Bootcamp.findOne({ user: request.user.id });

    if(publishedBootcamp && request.user.role !== 'admin') {
        return next(new ErrorResponse(`The user ${request.user.id} already have a published bootcamp`, 400));
    }

    const newBootcamp = await Bootcamp.create(request.body);
    response.status(201).json({ success: true, data: newBootcamp });
});

exports.updateBootcamp = asyncHandler(async (request, response, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found ${request.params.id}`, 404));
    }

    response.status(200).json({ success: true, data: bootcamp });
});

exports.deleteBootcamp = asyncHandler(async (request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found ${request.params.id}`, 404));
    }

    bootcamp.remove();

    response.status(200).json({ success: true, data: bootcamp._id })
});

exports.getBootcampsInRadius = asyncHandler(async (request, response, next) => {
    const { zipcode, distance } = request.params;
    const loc = await geocoder.geocode(zipcode);
    const location = loc[0];
    
    //earth radius = 3963 miles OR 6378 km
    const earthRadius = 3963;
    const radius = distance / earthRadius;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [ [location.longitude, location.latitude], radius ] }
        }
    });

    response.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
});

exports.bootcampPhotoUpload = asyncHandler(async (request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found ${request.params.id}`, 404));
    }

    if(!request.files) {
        return next(new ErrorResponse('No file detected', 400));
    }

    const file = request.files.file;
    
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Incorrect file type', 400));
    }

    if(file.size > process.env.FILE_UPLOAD_MAX_SIZE)     {
        return next(new ErrorResponse('File is too big', 400));
    }

    const filename = `bootcamp_${bootcamp._id}${path.parse(file.name).ext}`;
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${filename}`, async (error) => {
        if(error) {
            console.log(error);
            return next(new ErrorResponse('Server error', 500));
        }

        await Bootcamp.findByIdAndUpdate(request.params.id, {
            photo: filename
        });

        response.status(200).json({ success: true, data: filename });
    });
});