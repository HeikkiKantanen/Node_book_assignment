"use strict";

(function () {
	document.addEventListener("DOMContentLoaded", init);

	async function init() {
		try {
			const data = await fetch("/getAll"); // default GET
			const books = await data.json();

			const resultset = document.getElementById("resultset");
			for (let book of books) {
				const tr = document.createElement("tr");
				tr.appendChild(createCell(book.id));
				tr.appendChild(createCell(book.name));
				tr.appendChild(createCell(book.author));
				tr.appendChild(createCell(book.topic));
				tr.appendChild(createCell(book.type));
				resultset.appendChild(tr);
			}
		} catch (error) {
			document.getElementById(
				"messageArea"
			).innerHTML = `<p class = "error">${error.message}</p>`;
		}
	} // end of init

	function createCell(data) {
		const td = document.createElement("td");
		td.textContent = data;
		return td;
	}
})();
