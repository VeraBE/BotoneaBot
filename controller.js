const Model = require('./model');
const Config = require('./config');

const Controller = {};

Controller.botonear = async function botonear(context) {
	await Controller.storeMessage(context);

	if (context.message.reply_to_message === undefined) {
		context.reply(Config.messages.notAReply);
	} else if (context.message.reply_to_message.from.is_bot) {
		context.reply(Config.messages.replyToABot);
	} else {
		const messageVersions = await Model.botonear(context.message.chat.id, context.message.reply_to_message.message_id);
	
		if (messageVersions.length === 1) {
			context.reply(Config.messages.onlyOneVersionAvailable);
		} else if (messageVersions.length === 0) {
			context.reply(Config.messages.noVersionAvailable);
		} else {
			let response = '';
			messageVersions.forEach(function(version, index) {
				response = response + 'Version ' + (index + 1) + ': ';
				if ((response + version.message).length >= Config.messages.maxLength) {
					context.reply(response);
					context.reply(version.message);
					response = '';
				} else {
					response = response + version.message + '\n';
				}
			});

			if (Math.abs(messageVersions[0].message.length - messageVersions[messageVersions.length - 1].message.length) > Config.emojis.minLengthChange) {
				response = response + Config.emojis.options[Math.floor(Math.random() * Config.emojis.options.length)];
			}
			context.reply(response);
		}
	}
};

Controller.storeMessage = async function storeMessage(context) {
	await store(context.message, 'date');
};

Controller.storeEdited = async function storeEdited(context) {
	await store(context.update.edited_message, 'edit_date');
};

async function store(data, dateParam) {
	if (data.text !== undefined) {
		await Model.storeMessage(data.chat.id, data.message_id, data[dateParam], data.text);
	}
}

module.exports = Controller;