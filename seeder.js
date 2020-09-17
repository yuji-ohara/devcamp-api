const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));

const importData = async(terminateProcess) => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        console.log('Data imported'.green.inverse);
        if(terminateProcess === true) process.exit();
    }
    catch(error) {
        console.log(error);
    }
}

const deleteData = async(terminateProcess) => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        console.log('Data destroyed'.red.inverse);
        if(terminateProcess === true) process.exit();
    }
    catch(error) {
        console.log(error);
    }
}

if(process.argv[2] === '-i') {
    importData(true);
}
else if(process.argv[2] === '-d') {
    deleteData(true);
}
else if(process.argv[2] === '-r') {
    deleteData(false);
    importData(true);
}