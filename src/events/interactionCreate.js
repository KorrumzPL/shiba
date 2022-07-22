const { EmbedBuilder, InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		// Modal do komemdy eval
		if (interaction.type === InteractionType.ModalSubmit) {
			const colors = require('../utils/colors.json');
			const toEval = interaction.fields.getTextInputValue('code');
			try {
				const evaled = eval(toEval);
				const embed = new EmbedBuilder()
					.setColor(colors.green)
					.addFields([
						{ name: 'Input', value: `\`\`\`js\n${toEval}\n\`\`\`` },
						{ name: 'Output', value: `\`\`\`xl\n${evaled}\n\`\`\`` },
					]);
				interaction.reply({ embeds: [embed] });
			}
			catch (error) {
				const embed = new EmbedBuilder()
					.setColor(colors.red)
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