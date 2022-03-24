"use strict";

(function () {
	let idField;
	let nameField;
	let authorField;
	let topicField;
	let typeField;

	document.addEventListener("DOMContentLoaded", init);

	function init() {
		idField = document.getElementById("id");
		nameField = document.getElementById("name");
		authorField = document.getElementById("author");
		topicField = document.getElementById("topic");
		typeField = document.getElementById("type");

		document.getElementById("submit").addEventListener("click", send);
	} // end of init

	async function send() {
		console.log("clicked");
		const book = {
			id: idField.value,
			name: nameField.value,
			author: authorField.value,
			topic: topicField.value,
			type: typeField.value,
		};

		try {
			const options = {
				method: "POST",
				body: JSON.stringify(book),
				headers: {
					"Content-Type": "application/json",
				},
			};

			const data = await fetch("/add", options);
			const resultJson = await data.json();
			if (resultJson.message) {
				updateMessageArea(resultJson.message, resultJson.type);
			}
		} catch (error) {
			updateMessageArea(error.message, "error");
		}
	}
})();
