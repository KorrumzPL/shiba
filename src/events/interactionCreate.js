const { EmbedBuilder, InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		// Modal do komemdy eval
		if (interaction.type === InteractionType.ModalSubmit) {
			const toEval = interaction.fields.getTextInputValue('code');
			try {
				const evaled = eval(toEval);
				const embed = new EmbedBuilder()
					.setColor('#00ff00')
					.addFields([
						{ name: 'Input', value: `\`\`\`js\n${toEval}\n\`\`\`` },
						{ name: 'Output', value: `\`\`\`xl\n${evaled}\n\`\`\`` },
					]);
				interaction.reply({ embeds: [embed] });
			}
			catch (error) {
				const embed = new EmbedBuilder()
					.setColor('#ff0000')
					.addFields([
						{ name: 'Input', value: `\`\`\`js\n${toEval}\n\`\`\`` },
						{ name: 'Output', value: `\`\`\`xl\n${error}\n\`\`\`` },
					]);
				interaction.reply({ embeds: [embed] });
			}
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
			await interaction.reply({ content: 'Wystąpił błąd podczas wykonywania komendy.', ephemeral: true });
		}
	},
};