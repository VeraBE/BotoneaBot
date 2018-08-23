const Telegraf = require('telegraf');
const Controller = require('./controller');
const Model = require('./model');
const Config = require('./config');

setup();

async function setup() {
	await Model.setupDB();

	Model.setDataCleanUpTask();

	const BotoneaBot = new Telegraf(process.env.BOT_TOKEN);

	BotoneaBot.options.username = Config.general.name;

	BotoneaBot.command('botonea', (ctx) => Controller.botonear(ctx));
	BotoneaBot.on('message', (ctx) => Controller.storeMessage(ctx));
	BotoneaBot.on('edited_message', (ctx) => Controller.storeEdited(ctx));

	BotoneaBot.startPolling();
}