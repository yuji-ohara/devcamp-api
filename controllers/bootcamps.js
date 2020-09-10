const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getBootcamps = asyncHandler(async (request, response, next) => {
    const bootcamps = await Bootcamp.find();
    response.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

exports.getBootcamp = asyncHandler(async (request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found ${request.params.id}`, 404));
    }

    response.status(200).json({ success: true, data: bootcamp });
});

exports.createBootcamp = asyncHandler(async (request, response, next) => {
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
    const bootcamp = await Bootcamp.findByIdAndDelete(request.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found ${request.params.id}`, 404));
    }

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