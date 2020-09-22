const ErrorResponse = require("../utils/errorResponse");

function errorHandler(error, request, response, next) {
    let customError = { ...error };
    customError.message = error.message;

    console.log(error);

    if(error.name === 'CastError') {
        const message = 'Resource not found';
        customError = new ErrorResponse(message, 404);
    }

    if(error.name === 'MongoError') {
        if(error.code === 11000) {
            const message = 'Duplicate field value';
            customError = new ErrorResponse(message, 400);
        }
    }

    if(error.name === 'ValidatorError') {
        const message = Object.values(error.errors).map(val => val.message);
        customError = new ErrorResponse(message, 400);
    }

    response.status(customError.statusCode || 500).json({ success: false, error: customError.message || 'Server Error' });
}

module.exports = errorHandler;