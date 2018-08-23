module.exports = {
	general: {
		name: 'BotoneaBot'
	},
	database: {
		name: 'botoneabot',
		maxDataAgeInMinutes: 10
	},
	emojis: {
		options: ['😳', '🤔' , '👀', '🙈', '🙉', '🙊', '🌶'],
		minLengthChange: 10
	},
	messages: {
		notAReply: 'The command must be written in a reply to a recent text message.',
		replyToABot: 'Why do you want to spy on a bot?',
		onlyOneVersionAvailable: "The message wasn't edited so far or its too old.",
		noVersionAvailable: 'You can spy only on recent text messages.',
		maxLength: 4096
	}
};