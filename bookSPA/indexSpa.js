"use strict";

const http = require("http");
const path = require("path");
const cors = require("cors");

const express = require("express");
const fetch = require("node-fetch");

const app = express();

const { host, port } = require("./config.json");

// const { resolve } = require("path");

const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "menu.html")));

app.get("/getAll", (req, res) => {
	fetch("http://localhost:4001/api/books", { mode: "cors" })
		.then((data) => data.json())
		.then((result) => res.json(result))
		.catch((err) => res.json(err));
});

app.post("/getOne", (req, res) => {
	const bookId = req.body.bookId;
	if (bookId && bookId > 0) {
		fetch(`http://localhost:4001/api/books/${bookId}`, { mode: "cors" })
			.then((data) => data.json())
			.then((result) => res.json(result))
			.catch((err) => res.json(err));
	} else {
		res.json({ message: "empty id", type: "error" });
	}
});

app.post("/add", (req, res) => {
	const options = {
		method: "POST",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(req.body),
	};
	fetch("http://localhost:4001/api/books", options)
		.then((data) => data.json())
		.then((result) => res.json(result))
		.catch((err) => res.json(err));
});

app.post("/update", (req, res) => {
	const book = req.body;
	const options = {
		method: "PUT",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(book),
	};

	fetch(`http://localhost:4001/api/books/${book.bookId}`, options)
		.then((data) => data.json())
		.then((result) => res.json(result))
		.catch((err) => res.json(err));
	// console.log(result);
});

app.post("/remove", (req, res) => {
	const bookId = req.body.bookId;
	if (bookId && bookId.length > 0) {
		fetch(`http://localhost:4001/api/books/${bookId}`, {
			method: "DELETE",
			mode: "cors",
		})
			.then((data) => data.json())
			.then((result) => res.json(result))
			.catch((err) => res.json(err));
	} else {
		res.json({ messge: "empty id", type: "error" });
	}
});

server.listen(port, host, () =>
	console.log(`Server ${host} : ${port} running...`)
);
