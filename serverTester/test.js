"use strict";

(function () {
	let method = "get";
	let textarea;
	let urifield;
	let messagearea;
	document.addEventListener("DOMContentLoaded", init);

	function init() {
		urifield = document.getElementById("uri");
		textarea = document.getElementById("textarea");
		messagearea = document.getElementById("messagearea");
		document.getElementById("submit").addEventListener("click", send);
		document.getElementById("methods").addEventListener("change", choose);
		clearsection();
		urifield.value = "http://localhost:4000/api/books";
	}

	function showData(data) {
		messagearea.textContent = JSON.stringify(data, null, 4);
	}

	async function send() {
		let options = {
			method: method,
			mode: "cors",
			headers: { "Content-Type": "application/json" },
		};

		if (method === "put" || "method" === "post") {
			options.body = textarea.value;
		}
		try {
			const data = await fetch(urifield.value, options);
			const res = await data.json();
			showData(res);
		} catch (err) {
			showData({ message: message.err, type: "error" });
		}
	}
	function choose(e) {
		e.preventDefault();
		method = e.target.value;
	}
	function clearsection() {
		messagearea.textContent = "";
	}
})();
