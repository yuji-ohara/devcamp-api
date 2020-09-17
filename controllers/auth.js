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

    sendTokenResponse(user, 200, response);
});

exports.login = asyncHandler(async (request, response, next) => {
    const { email, password } = request.body;

    if(!email || !password) {
        return next(new ErrorResponse('Email/password missing', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, response);
});

exports.getMe = asyncHandler(async (request, response, next) => {
    const user = await User.findById(request.user.id);

    response.status(200).json({ success: true, data: user });
});

const sendTokenResponse = (user, statusCode, response) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    response.status(statusCode).cookie('token', token, options).json({ success: true, token });
};