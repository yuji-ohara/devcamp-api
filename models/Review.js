const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Title required'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Text required']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Rating (1 - 10) required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});


ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const objs = await this.aggregate([
        { $match: { bootcamp: bootcampId } },
        { $group: {
            _id: '$bootcamp',
            averageRating: { $avg: '$rating' }
        } }
    ]);
    
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: objs[0].averageRating
        });
    } catch (error) {
        console.log(error);
    }
};

ReviewSchema.post('save', function(next) {
    this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.bootcamp);
});

//single review per user per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);