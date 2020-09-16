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

CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const objs = await this.aggregate([
        { $match: { bootcamp: bootcampId } },
        { $group: {
            _id: '$bootcamp',
            averageCost: { $avg: '$tuition' }
        } }
    ]);
    
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(objs[0].averageCost / 10) * 10
        });
    } catch (error) {
        console.log(error);
    }
}

CourseSchema.post('save', function(next) {
    this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);