require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const upload = require('express-fileupload');
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
app.use(upload());

//Test get event
app.get('/', (req, res) => {
    res.send('Request working');
});

//Get all events
app.get('/getEvents', (req, res) => {
    connection.query('SELECT * FROM covid_screening.events', (err, result, fields) => {
        res.send(result);
    });    
});

//Get a specific event
app.get('/getEvent/:id', (req, res) => {
    connection.query('SELECT * FROM covid_screening.events WHERE id = ? LIMIT 1', req.params.id, (err, result, fields) => {
        res.send(result);
    }); 
});

//Create an event
app.post('/createEvent', (req, res) => {
    let eventName, eventDate, eventPlace, eventURL, eventTime, eventDescription, eventContactPerson, eventContactDetails;

    eventName = req.body.eventName;
    eventDate = req.body.eventDate;
    eventPlace = req.body.eventPlace;
    eventURL = req.body.eventURL;
    eventTime = req.body.eventTime;
    eventDescription = req.body.eventDescription;
    eventContactPerson = req.body.eventContactPerson;
    eventContactDetails = req.body.eventContactDetails;
    
    connection.query(`INSERT INTO covid_screening.events (event_name, event_place, event_date, event_img, event_time, event_description, event_contact_person, event_contact_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [eventName, eventPlace, eventDate, eventURL, eventTime, eventDescription, eventContactPerson, eventContactDetails], (err, result, fields) => {
        if (err) throw err;
        res.send(`Success! New row number: ${result.insertId}`);
    }); 
});

//Send image
app.get('/getImage/:imageName', (req, res) => {
    let options = {
        root: __dirname + '/uploads'
    }
    let fileName = req.params.imageName;
    res.sendFile(fileName, options, (err) => {
        if (err) {
            console.log(err);
        }
    });
});

//Update an event
app.put('/updateEvent/:id', (req, res) => {
    console.log('PUT SUCCESS!');
    
    let eventName, eventDate, eventPlace, eventURL, eventTime, eventDescription, eventContactPerson, eventContactDetails;

    eventName = req.body.eventName;
    eventDate = req.body.eventDate;
    eventPlace = req.body.eventPlace;
    eventURL = req.body.eventURL;
    eventTime = req.body.eventTime;
    eventDescription = req.body.eventDescription;
    eventContactPerson = req.body.eventContactPerson;
    eventContactDetails = req.body.eventContactDetails;
    
    connection.query(`UPDATE covid_screening.events SET event_name = ?, event_place = ?, event_date = ?, event_img = ?, event_time = ?, event_description = ?, event_contact_person = ?, event_contact_details = ? WHERE id = ?`, [eventName, eventPlace, eventDate, eventURL, eventTime, eventDescription, eventContactPerson, eventContactDetails, req.params.id], (err, result, fields) => {
        if (err) throw err;
        res.send(`Success! Updated row: ${req.params.id}`);
    }); 
});

//Delete an event
app.delete('/deleteEvent/:id', (req, res) => {
    connection.query('DELETE FROM covid_screening.events WHERE id = ?', req.params.id, (err, result, fields) => {
        if (err) throw err;
        res.send(`Success! Deleted row: ${req.params.id}`);
    }); 
})

//Upload file
app.post('/uploadFile', (req, res) => {
    if (req.files) {
        let file = req.files.file
        let filename = file.name
        console.log(req.files);

        file.mv('./uploads/'+filename, (err) => {
            if (err) {
                console.log(err);
            }
        });

        res.json({filepath: __dirname+'/uploads/'+filename});
    }
});

app.listen(process.env.PORT);