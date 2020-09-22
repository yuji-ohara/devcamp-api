const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const crypto = require('crypto');

exports.getUsers = asyncHandler(async (request, response, next) => {
    response.status(200).json(response.advancedResults);
});

exports.getUser = asyncHandler(async (request, response, next) => {
    const user = await User.findById(request.params.id);

    response.status(200).json({ success: true, data: user });
});

exports.createUser = asyncHandler(async (request, response, next) => {
    const user = await User.create(request.body);

    response.status(201).json({ success: true, data: user });
});

exports.updateUser = asyncHandler(async (request, response, next) => {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    });

    response.status(200).json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (request, response, next) => {
    await User.findByIdAndDelete(request.params.id);

    response.status(200).json({ success: true, data: `User ${request.params.id} removed` });
});