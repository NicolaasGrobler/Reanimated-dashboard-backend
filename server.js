require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const upload = require('express-fileupload');
const cors = require('cors');
const sql = require('mysql');
const app = express();
const fs = require('fs');


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
    connection.query(`SELECT * FROM ${process.env.DBName}.events`, (err, result, fields) => {
        res.send(result);
    });    
});

//Get a specific event
app.get('/getEvent/:id', (req, res) => {
    connection.query(`SELECT * FROM ${process.env.DBName}.events WHERE id = ? LIMIT 1`, req.params.id, (err, result, fields) => {
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
    
    connection.query(`INSERT INTO ${process.env.DBName}.events (event_name, event_place, event_date, event_img, event_time, event_description, event_contact_person, event_contact_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [eventName, eventPlace, eventDate, eventURL, eventTime, eventDescription, eventContactPerson, eventContactDetails], (err, result, fields) => {
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
            throw err;
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
    
    connection.query(`UPDATE ${process.env.DBName}.events SET event_name = ?, event_place = ?, event_date = ?, event_img = ?, event_time = ?, event_description = ?, event_contact_person = ?, event_contact_details = ? WHERE id = ?`, [eventName, eventPlace, eventDate, eventURL, eventTime, eventDescription, eventContactPerson, eventContactDetails, req.params.id], (err, result, fields) => {
        if (err) throw err;
        res.send(`Success! Updated row: ${req.params.id}`);
    }); 
});

//Delete an event
app.delete('/deleteEvent/:id', (req, res) => {
    connection.query(`DELETE FROM ${process.env.DBName}.events WHERE id = ?`, req.params.id, (err, result, fields) => {
        if (err) throw err;
        res.send(`Success! Deleted row: ${req.params.id}`);
    }); 
})

//Upload file
app.post('/uploadFile', (req, res) => {
    if (req.files) {
        let today = new Date();
        let date = today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate();
        let time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
        let dateTime = date+''+time;

        let file = req.files.file
        let extension = file.name;
        extension = extension.split('.');
        extension = extension[extension.length - 1];
        let filename = dateTime + '.' + extension;

        console.log(filename);

        file.mv('./uploads/'+filename, (err) => {
            if (err) {
                console.log(err);
            }
        });

        res.json({
            filepath: __dirname+'/uploads/'+filename,
            fileName: filename
        });
    }
});

//Delete File
app.post('/deleteFile/:fileName', (req, res) => {
    fs.unlink(__dirname+'/uploads/'+req.params.fileName, () => {
        res.send('File Deleted');
    })
});

//Get Time
app.get('/getTime', (req, res) => {
    let today = new Date();
    let date = today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate();
    let time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
    let dateTime = date+''+time;

    res.send(dateTime);
});

app.listen(process.env.PORT);