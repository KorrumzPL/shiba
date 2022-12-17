const { InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.type === InteractionType.ApplicationCommand) return;
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
		}
	},
};