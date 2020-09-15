const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Title required']
    },
    description: {
        type: String,
        required: [true, 'Description required']
    },
    weeks: {
        type: String,
        required: [true, 'Weeks required']
    },
    tuition: {
        type: Number,
        required: [true, 'Tuition cost required']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Minimum skill required'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailabel: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

module.exports = mongoose.model('Course', CourseSchema);