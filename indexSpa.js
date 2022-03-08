'use strict';

const http = require('http');
const path = require('path');
const cors = require('cors');
const fetch = require('./fetchlib');

const express = require('express');
const app = express();

const {port, host} = require('./config.json');
const { resolve } = require('path');

const server = http.createServer(app);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'menu.html')))

app.get('/getAll', (req, res) => {
    fetch('http://localhost:4000/api/books', {mode: 'cors'})
        .then(data => data.json())
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

app.post('/getOne', (req, res) => {
    const bookID = req.body.id;
    if (bookID && bookID.length > 0) {
        fetch(`http://localhost:4000/api/books/${bookID}`, {mode: 'cors'})
            .then(data => data.json())
            .then(result => res.json(result))
            .catch(err => res.json(err));
    }
    else {
        res.json({message: 'empty id', type: 'error'});
    }
});

app.post('/remove', (req, res) => {
    const bookID = req.body.id;

    if (bookID && bookID.length > 0) {
        fetch(`http://localhost:4000/api/books/${bookID}`, {method: 'DELETE', mode: 'cors'})
            .then(data => data.json())
            .then(result => res.json(result))
            .catch(err => res.json(err));
    }
    else {
        res.json({messge: 'empty id', type: 'error'});
    }
});

app.post('/insert', (req, res) => {
    const book = req.body;
    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(book)
    };

    fetch('http://localhost:4000/api/books', options)
        .then(data => data.json())
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

app.all('*', (req, res) => res.json('not supported'));

server.listen(port, host,
    () => console.log(`Server ${host} : ${port} running...`));