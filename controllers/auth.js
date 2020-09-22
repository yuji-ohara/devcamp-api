const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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

exports.updateDetails = asyncHandler(async (request, response, next) => {
    const fieldsToUpdate = {
        name: request.body.name,
        email: request.body.email
    };


    const user = await User.findByIdAndUpdate(request.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    response.status(200).json({ success: true, data: user });
});

exports.updatePassword = asyncHandler(async (request, response, next) => {
    const user = await User.findById(request.user.id).select('+password');

    if(!(await user.matchPassword(request.body.currentPassword))) {
        return next(new ErrorResponse('Incorrect password', 401));
    }

    user.password = request.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, response);
});

exports.forgotPassword = asyncHandler(async (request, response, next) => {
    const user = await User.findOne({ email: request.body.email });

    if(!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${request.protocol}://${request.get('host')}/api/v1/auth/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password recovery',
            message
        });

        response.status(200).json({ success: true, data: 'Email sent' });
    }
    catch(error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Error during operation', 500));
    }
});

exports.resetPassword = asyncHandler(async (request, response, next) => {
    console.log(request.params.resetToken);
    const hashedResetToken = crypto.createHash('sha256').update(request.params.resetToken).digest('hex');

    const user = await User.findOne({ resetPasswordToken: hashedResetToken, resetPasswordExpire: { $gt: Date.now() } });

    if(!user) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    user.password = request.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, response);
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