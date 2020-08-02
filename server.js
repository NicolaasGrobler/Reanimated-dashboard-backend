require('dotenv').config();
const express = require('express');
const sql = require('mysql');
const app = express();

let connection = sql.createConnection({
    host: process.env.serverHOST,
    user: process.env.serverUSER,
    password: process.env.serverPASSWORD
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to sql server');
});

console.log(`Server running on port: ${process.env.PORT}`);

app.get('/', (req, res, next) => {
    res.send('Request working');
});

app.get('/getEvents', (req, res, next) => {
    connection.query('SELECT * FROM covid_screening.events', (err, result, fields) => {
        res.send(result);
    });    
});

app.listen(process.env.PORT);