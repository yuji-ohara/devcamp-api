const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT;

const bootcamps = require('./routes/bootcamps');

const app = express();

app.use('/api/v1/bootcamps', bootcamps);


app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`));
