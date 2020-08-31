const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });
const app = express();
const PORT = process.env.PORT;

app.get('/api/v1/bootcamps', (request, response) => {
    response.status(200).json({ success: true, message: 'Show all bootcamps'});
});

app.get('/api/v1/bootcamps/:id', (request, response) => {
    response.status(200).json({ success: true, message: `Get bootcamps by id: ${request.params.id}`});
});

app.post('/api/v1/bootcamps', (request, response) => {
    response.status(200).json({ success: true, message: 'Create bootcamps method'});
});

app.put('/api/v1/bootcamps/:id', (request, response) => {
    response.status(200).json({ success: true, message: `Update bootcamps by id: ${request.params.id}`});
});

app.delete('/api/v1/bootcamps/:id', (request, response) => {
    response.status(200).json({ success: true, message: `Exclude method, id: ${request.params.id}`});
});

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`));
