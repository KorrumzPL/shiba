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
			if (!interaction.channel) return;
			await interaction.channel.send('Wystąpił błąd podczas wykonywania komendy. Spróbuj ponownie.\nJeśli nadal coś nie działa, zgłoś błąd na Shiba Support lub do Nomz#0630.');
		}
	},
};