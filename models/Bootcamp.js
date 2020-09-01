const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name too long (50+)']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Description required'],
        maxlength: [500, 'Description too long (500+)']
    },
    website: {
        type: String,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/]
    }
});