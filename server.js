const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT;

connectDB();

const bootcamps = require('./routes/bootcamps');

const app = express();
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use('/api/v1/bootcamps', bootcamps);

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow.bold));

process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.message}`.red.bold);
    server.close(() => {
        process.exit(1);
    });
});