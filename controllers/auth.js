const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.registerUser = asyncHandler(async (request, response, next) => {
    const { name, email, password, role } = request.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    response.status(200).json({ success: true, data: user });
});