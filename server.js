require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
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

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.send('Request working');
});

app.get('/getEvents', (req, res, next) => {
    connection.query('SELECT * FROM covid_screening.events', (err, result, fields) => {
        res.send(result);
    });    
});

app.get('/getEvent/:id', (req, res, next) => {
    connection.query('SELECT * FROM covid_screening.events WHERE id = ? LIMIT 1', req.params.id, (err, result, fields) => {
        res.send(result);
    }); 
});

app.post('/createEvent', (req, res, next) => {
    let eventName, eventDate, eventPlace, eventURL;

    eventName = req.body.eventName;
    eventDate = req.body.eventDate;
    eventPlace = req.body.eventPlace;
    eventURL = req.body.eventURL;
    eventTime = req.body.eventTime;
    eventDescription = req.body.eventDescription;
    eventContactPerson = req.body.eventContactPerson;
    eventContactDetails = req.body.eventContactDetails;

    console.log(eventDescription);
    
    connection.query(`INSERT INTO covid_screening.events (event_name, event_place, event_date, event_img, event_time, event_description, event_contact_person, event_contact_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [eventName, eventPlace, eventDate, eventURL, eventTime, eventDescription, eventContactPerson, eventContactDetails], (err, result, fields) => {
        if (err) throw err;
        res.send(`Success! New row number: ${result.insertId}`);
    }); 
});

app.listen(process.env.PORT);