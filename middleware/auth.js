const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (request, response, next) => {
    let token;

    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        token = request.headers.authorization.split(' ')[1];
    }
    else if(request.cookies.token) {
        token = request.cookies.token;
    }

    if(!token) {
        return next(new ErrorResponse('Unauthorized route', 401));
    }

    try {
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);

        request.user = await User.findById(decodedJwt.id);
        next();
    }
    catch(error) {
        console.log(error);
        return next(new ErrorResponse('Server error', 500));
    }
});

exports.authorize = (...roles) => {
    return (request, response, next) => {
        if(!roles.includes(request.user.role)) {
            return next(new ErrorResponse(`Unauthorized operation (user role: ${request.user.role})`, 403));
        }
        next();
    }
};