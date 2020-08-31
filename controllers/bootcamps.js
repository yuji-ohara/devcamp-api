// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (request, response, next) => {
    response.status(200).json({ success: true, message: 'Show all bootcamps'});
};

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (request, response, next) => {
    response.status(200).json({ success: true, message: `Get bootcamps by id: ${request.params.id}`});
};

// @desc    Create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (request, response, next) => {
    response.status(200).json({ success: true, message: 'Create bootcamps method'});
};

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (request, response, next) => {
    response.status(200).json({ success: true, message: `Update bootcamps by id: ${request.params.id}`});
};

// @desc    Create a bootcamp
// @route   DELETE /api/v1/bootcamps
// @access  Private
exports.deleteBootcamp = (request, response, next) => {
    response.status(200).json({ success: true, message: `Exclude method, id: ${request.params.id}`});
};