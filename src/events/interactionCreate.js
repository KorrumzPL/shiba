const { InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		// Komenda cafe - przycisk
		if (interaction.isButton() && interaction.customId.includes('cafe-')) {
			if (interaction.customId.split('-')[2] !== interaction.user.id) return interaction.reply({ content: 'To nie twoje. Nie ruszaj tego!', ephemeral: true });
			const cafe = require('../utils/cafe/cafe.json');
			await interaction.update({ content: cafe[`${interaction.customId.split('-')[1]}-using`].replace('[user]', `<@${interaction.user.id}>`), components: [] });
			await interaction.followUp({ content: cafe[`${interaction.customId.split('-')[1]}-used`], tts: true });
			return;
		}

		// Komendy
		if (!interaction.type === InteractionType.ApplicationCommand) return;
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			if (!interaction.channel) return;
			await interaction.channel.send('Wystąpił błąd podczas wykonywania komendy.')
				.then(message => {
					setTimeout(() => message.delete(), 5000);
				});
		}
	},
};