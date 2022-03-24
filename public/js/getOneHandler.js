"use strict";

(function () {
	let resultarea;
	let inputfield;

	document.addEventListener("DOMContentLoaded", init);

	function init() {
		resultarea = document.getElementById("resultArea");
		inputfield = document.getElementById("id");
		document.getElementById("submit").addEventListener("click", send);
	} // end of init

	async function send() {
		clearMessagearea();
		resultarea.innerHTML = "";
		const id = inputfield.value;
		try {
			const options = {
				method: "POST",
				body: JSON.stringify({ id }),
				headers: {
					"Content-Type": "application/json",
				},
			};

			const data = await fetch("/getOne", options);
			const resultJson = await data.json();
			updatePage(resultJson);
		} catch (error) {
			updateMessagearea(error.message, "error");
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
		resultarea.innerHTML = `
        <p><span class="legend">Id: </span>${book.id}</p>
        <p><span class="legend">Name: </span>${book.name}</p>
        <p><span class="legend">Author: </span>${book.author}</p>
        <p><span class="legend">Topic: </span>${book.topic}</p>
        <p><span class="legend">Type: </span>${book.type}</p>
        `;
	} // end of updateBook
})();
