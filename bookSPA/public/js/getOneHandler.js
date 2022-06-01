"use strict";

(function () {
	let resultArea;
	let inputField;

	document.addEventListener("DOMContentLoaded", init);

	function init() {
		resultArea = document.getElementById("resultArea");
		inputField = document.getElementById("inputId");
		document.getElementById("submit").addEventListener("click", send);
	} // end of init

	async function send() {
		clearMessagearea();
		resultArea.innerHTML = "";
		const bookId = inputField.value;
		try {
			const options = {
				method: "POST",
				body: JSON.stringify({ bookId }),
				headers: { "Content-Type": "application/json" },
			};

			const data = await fetch("/getOne", options);
			const result = await data.json();
			updatePage(result);
		} catch (err) {
			updateMessagearea(err.message);
		}
	} // end of send

	function updatePage(result) {
		if (result) {
			if (result.message) {
				updateMessagearea(result.message, result.type);
			} else {
				updateBook(result);
			}
		} else {
			updateMessagearea("Not found", "error");
		}
	} // end of updatePage

	function updateBook(book) {
		resultArea.innerHTML = `
        <p><span class="bold">Id: </span>${book.bookId}</p>
        <p><span class="bold">Name: </span>${book.name}</p>
        <p><span class="bold">Author: </span>${book.author}</p>
        <p><span class="bold">Topic: </span>${book.topic}</p>
        <p><span class="bold">Type: </span>${book.type}</p>
        `;
	} // end of updateBook
})();
