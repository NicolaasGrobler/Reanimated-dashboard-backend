require('dotenv').config();
const express = require('express');
const app = express();

console.log(`Server running on port: ${process.env.PORT}`);

app.get('/', (req, res, next) => {
    res.send('Hello');
});

app.listen(process.env.PORT);