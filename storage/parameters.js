"use strict";

const toArrayInsert = (book) => [
	+book.id,
	book.name,
	book.author,
	book.topic,
	book.type,
];

// returns for example [1, "LOTR", "Tolkien", "war", "fantasy" ]

const toArrayUpdate = (book) => [
	book.name,
	book.author,
	book.topic,
	book.type,
	+book.id,
];

module.exports = { toArrayInsert, toArrayUpdate };
