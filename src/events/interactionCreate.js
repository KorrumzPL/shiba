const { EmbedBuilder, InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		// Komenda cafe
		if (interaction.isButton()) {
			const cafe = require('../utils/cafe/cafe.json');
			await interaction.update({ content: cafe[`${interaction.customId}1`].replace('user', `<@${interaction.user.id}>`), components: [] });
			await interaction.followUp({ content: cafe[`${interaction.customId}2`], tts: true });
			return;
		}

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
			if (!interaction.channel) return;
			await interaction.channel.send('Wystąpił błąd podczas wykonywania komendy.')
				.then(message => {
					setTimeout(() => message.delete(), 5000);
				});
		}
	},
};