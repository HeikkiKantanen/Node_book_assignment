"use strict";

(function () {
	let idField;
	let nameField;
	let authorField;
	let topicField;
	let typeField;
	let searchState = true;
	document.addEventListener("DOMContentLoaded", init);

	function init() {
		idField = document.getElementById("id");
		nameField = document.getElementById("name");
		authorField = document.getElementById("author");
		topicField = document.getElementById("topic");
		typeField = document.getElementById("type");
		updateFields();
		document.getElementById("submit").addEventListener("click", send);
		idField.addEventListener("focus", clearAll);
	} // end of init

	function clearAll() {
		if (searchState) {
			clearFieldValues();
			clearMessagearea();
		}
	}

	function updateFields() {
		if (searchState) {
			idField.removeAttribute("readonly");
			nameField.setAttribute("readonly", true);
			authorField.setAttribute("readonly", true);
			topicField.setAttribute("readonly", true);
			typeField.setAttribute("readonly", true);
		} else {
			idField.setAttribute("readonly", true);
			nameField.removeAttribute("readonly");
			authorField.removeAttribute("readonly");
			topicField.removeAttribute("readonly");
			typeField.removeAttribute("readonly");
		}
	}

	function updateBookValues(book) {
		idField.value = book.bookId;
		nameField.value = book.name;
		authorField.value = book.author;
		topicField.value = book.topic;
		typeField.value = book.type;
		searchState = false;
		updateFields();
	}

	function clearFieldValues() {
		idField.value = "";
		nameField.value = "";
		authorField.value = "";
		topicField.value = "";
		typeField.value = "";
		searchState = true;
		updateFields();
	}

	async function send() {
		try {
			if (searchState) {
				clearMessagearea();
				const bookId = idField.value;
				const options = {
					method: "POST",
					body: JSON.stringify({ bookId }),
					headers: { "Content-Type": "application/json" },
				};
				const data = await fetch("/getOne", options);
				const getResult = await data.json();
				if (getResult) {
					if (getResult.message) {
						updateMessagearea(getResult.message, getResult.type);
					} else {
						updateBookValues(getResult);
					}
				} else {
					updateMessagearea("Product Not Found", "error");
				}
			} else {
				const book = {
					bookId: +idField.value,
					name: nameField.value,
					author: authorField.value,
					topic: topicField.value,
					type: typeField.value,
				};
				const options = {
					method: "POST",
					body: JSON.stringify(book),
					headers: { "Content-Type": "application/json" },
				};
				const data = await fetch("/update", options);
				const resultJson = await data.json();
				if (resultJson.message) {
					updateMessagearea(resultJson.message, resultJson.type);
				}
				searchState = true;
				updateFields();
			}
		} catch (err) {
			updateMessagearea(err.message, "error");
		}
	}
})();
