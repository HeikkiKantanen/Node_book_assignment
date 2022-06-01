"use strict";

const Database = require("../database");

let createStatementFile = "./Kantanen_Heikki_book_createStatements.json";

if (process.argv.length > 2) {
	createStatementFile = `./${process.argv[2]}`;
}

const printMessage = (message) => console.log(message);

const printStatement = (statement) => printMessage(`${statement};`);

const errMessage = (message) =>
	printMessage(`########## ${message} ##########`);

const createDb = async (createStatements) => {
	const options = {
		host: createStatements.host,
		port: createStatements.port,
		user: createStatements.admin,
		password: createStatements.adminpassword,
	};

	// async function createDb(createStatements) {
	//     const options = {
	//         host: createStatements.host,
	//         port: createStatements.port,
	//         user: createStatements.admin,
	//         password: createStatements.adminpassword
	//     };
	const DEBUG = createStatements.debug;
	const db = new Database(options);
	const user = `'${createStatements.user}'@'${createStatements.host}'`;
	const DB = createStatements.database;
	const dropDatabaseSql = `drop database if exists ${createStatements.database}`;
	const createDatabaseSql = `create database ${createStatements.database}`;
	const dropUserSql = `drop user if exists ${user}`;
	const createUserSql =
		`create user if not exists ${user} ` +
		`identified by '${createStatements.password}'`;
	const grantPrivilegesSql = `grant all privileges on ${DB}.* to ${user}`;

	try {
		await db.doQuery(dropDatabaseSql);
		if (DEBUG) printStatement(dropDatabaseSql);

		await db.doQuery(createDatabaseSql);
		if (DEBUG) printStatement(createDatabaseSql);

		if (createStatements.dropuser) {
			await db.doQuery(dropUserSql);
			if (DEBUG) printStatement(dropUserSql);
		}

		await db.doQuery(createUserSql);
		if (DEBUG) printStatement(createUserSql);

		await db.doQuery(grantPrivilegesSql);
		if (DEBUG) printStatement(grantPrivilegesSql);

		for (let table of createStatements.tables) {
			if (table.columns && table.columns.length > 0) {
				const createTableSql =
					`create table ${createStatements.database}.${table.tableName}(` +
					`\n\t${table.columns.join(",\n\t")}` +
					")";

				await db.doQuery(createTableSql);
				if (DEBUG) printStatement(createTableSql);
			} else {
				if (DEBUG) printMessage("Table columns missing. Table was not created");
			}

			if (table.data && table.data.length > 0) {
				const rows = [];
				for (let data of table.data) {
					const insertSql = `insert into ${createStatements.database}.${
						table.tableName
					} values(${Array(data.length).fill("?").join(",")})`;
					rows.push(db.doQuery(insertSql, data));
				}
				await Promise.all(rows);
				if (DEBUG) printMessage("data added");
			} else {
				if (DEBUG) printMessage("data missing");
			}
		}
	} catch (error) {
		errMessage(error.message);
	}
};

try {
	createDb(require(createStatementFile));
} catch (error) {
	errMessage(error.message);
}
