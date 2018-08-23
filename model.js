const { Client } = require('pg');
const Config = require('./config');

const DATABASE_USER = process.env.DB_USER;
const DATABASE_PASSWORD = process.env.DB_PASSWORD;

const Model = {};

Model.setupDB = async function setupDB() {
	const client = new Client({
		user: DATABASE_USER,
		password: DATABASE_PASSWORD,
		database: 'postgres'

	});
	await client.connect();
	
	const res = await client.query('SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower($1)', [Config.database.name]);
	
	if (res.rows.length === 0) {
		await client.query('CREATE DATABASE ' + Config.database.name)
		client.end();

		const newClient = await getConnectedClient();
		await newClient.query('CREATE TABLE messages (chat_id bigint NOT NULL, message_id bigint NOT NULL, message_date timestamp without time zone NOT NULL, message text NOT NULL)');
		await newClient.query('CREATE INDEX ON messages (chat_id, message_id)');
		newClient.end();
	} else {
		client.end();
	}
};

Model.setDataCleanUpTask = function setDataCleanUpTask() {
	setInterval(async function() {
		const client = await getConnectedClient();
		await client.query("DELETE FROM messages WHERE message_date < NOW() - INTERVAL '" + Config.database.maxDataAgeInMinutes + " minutes'");
		client.end()
	}, Config.database.maxDataAgeInMinutes * 60 * 1000);
};

Model.botonear = async function botonear(chatID, messageID) {
	const client = await getConnectedClient();
	const res = await client.query('SELECT * FROM messages WHERE chat_id = $1 AND message_id = $2 ORDER BY message_date ASC', [chatID, messageID]);
	client.end();
	return res.rows;
};

Model.storeMessage = async function storeMessage(chatID, messageID, date, text) {
	const client = await getConnectedClient();
	await client.query('INSERT INTO messages VALUES ($1, $2, to_timestamp($3), $4)', [chatID, messageID, date, text]);
	client.end();
};

async function getConnectedClient() {
	const client = new Client({
		user: DATABASE_USER,
		password: DATABASE_PASSWORD,
		database: Config.database.name
	});
	await client.connect();
	return client;
}

module.exports = Model;