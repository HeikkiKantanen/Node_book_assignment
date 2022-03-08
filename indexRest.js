'use strict';

const http = require('http');
const path = require('path');
const cors = require('cors');

const express = require('express');
const app = express();

const {host, port} = require(path.join(__dirname, 'configRest.json'));

const DataStorage = require(path.join(__dirname, 'storage', 'dataStorageLayer.js'));

const storage = new DataStorage();

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/api/books', (req, res) => 
    storage.getAll()
        .then(result => res.json(result))
        .catch(err => res.json(err))
);

app.get('/api/books/bookID', (req, res) => 
    storage.get(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.json(err))
);

app.post('/api/books', (req, res) => {
    const book = req.body;
    storage.insert(book)
        .then(status => res.json(status))
        .catch(err => res.json(err));
});

app.put('/api/books/bookID', (req, res) => {
    const book = req.body;
    const id = req.params.id;
    storage.update(id, book)
        .then(status => res.json(status))
        .catch(err => res.json(err));
});

app.delete('/api/books/bookID', (req, res) =>
    storage.remove(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.json(err))
);

app.all('*', (req, res) => res.json('not supported'));

server.listen(port, host, () => console.log(`Server ${host} : ${port} available`));

