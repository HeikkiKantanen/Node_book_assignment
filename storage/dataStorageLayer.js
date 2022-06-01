"use strict";

const { CODES, TYPE, MESSAGES } = require("./statusCodes");

const sql = require("./sqlStatements.json");

const getAllSql = sql.getAll.join(" ");
const getSql = sql.get.join(" ");
const insertSql = sql.insert.join(" ");
const updateSql = sql.update.join(" ");
const removeSql = sql.remove.join(" ");
const PRIMARY_KEY = sql.primaryKey;

const { toArrayInsert, toArrayUpdate } = require("./parameters");

const Database = require("./database");

const options = require("./databaseOptions.json");

// console.log(getAllSql);
// console.log(getSql);
// console.log(insertSql);
// console.log(updateSql);
// console.log(removeSql);
// console.log(PRIMARY_KEY);

module.exports = class DataStorage {
	constructor() {
		this.db = new Database(options);
	}

	get CODES() {
		return CODES;
	}

	getAll() {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await this.db.doQuery(getAllSql);
				resolve(res.queryResult);
			} catch (error) {
				// console.log(error);
				reject(MESSAGES.PROGRAM_ERROR());
			}
		});
	} // end of getAll

	get(key) {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await this.db.doQuery(getSql, [key]);
				if (res.queryResult.length > 0) {
					resolve(res.queryResult[0]);
				} else {
					resolve(MESSAGES.NOT_FOUND(PRIMARY_KEY, key));
				}
			} catch (err) {
				console.log(error);
				// reject.apply(MESSAGES.PROGRAM_ERROR());
				reject(MESSAGES.PROGRAM_ERROR());
			}
		});
	} // end of get

	remove(key) {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await this.db.doQuery(removeSql, [key]);
				if (res.queryResult.rowsChanged === 1) {
					resolve(MESSAGES.DELETE_OK(PRIMARY_KEY, key));
				} else {
					resolve(MESSAGES.NOT_DELETED(PRIMARY_KEY, key));
				}
			} catch (error) {
				console.log(error);
				reject(MESSAGES.PROGRAM_ERROR());
			}
		});
	} // end of remove

	insert(data) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.db.doQuery(insertSql, toArrayInsert(data));
				resolve(MESSAGES.INSERT_OK(PRIMARY_KEY, data[PRIMARY_KEY]));
			} catch (error) {
				reject(MESSAGES.NOT_INSERTED());
			}
		});
	} // end of insert

	update(key, data) {
		return new Promise(async (resolve, reject) => {
			try {
				if (key && data) {
					// if (resource[PRIMARY_KEY] != key) {
					// 	reject(MESSAGES.KEYS_DO_NOT_MATCH(key, resource[PRIMARY_KEY], key));
					if (data[PRIMARY_KEY] != key) {
						reject(MESSAGES.KEYS_DO_NOT_MATCH(data[PRIMARY_KEY], key));
					} else {
						const fetchData = await this.db.doQuery(getSql, [key]);
						if (fetchData.queryResult.length > 0) {
							const res = await this.db.doQuery(updateSql, toArrayUpdate(data));
							// if (result.queryResult.rowsChanged === 0) {
							// 	resolve(MESSAGES.NOT_UPDATED());
							// } else {
							// 	resolve(MESSAGES.UPDATE_OK(PRIMARY_KEY, resource[PRIMARY_KEY]));
							// }
							if (res.queryResult.rowsChanged !== 0) {
								resolve(MESSAGES.UPDATE_OK(PRIMARY_KEY, data[PRIMARY_KEY]));
							} else {
								resolve(MESSAGES.NOT_UPDATED());
							}
						} else {
							this.insert(data)
								.then((status) => resolve(status))
								.catch((error) => reject(error));
						}
					}
				} else {
					reject(MESSAGES.NOT_UPDATED());
				}
			} catch (error) {
				console.log(error);
				reject(MESSAGES.PROGRAM_ERROR());
			}
		});
	} // end of update
};
