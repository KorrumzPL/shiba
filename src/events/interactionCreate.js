const { EmbedBuilder, InteractionType, AttachmentBuilder } = require('discord.js');

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
			const clean = async (text, client) => {
				if (text && text.constructor.name == 'Promise') text = await text;
				if (typeof text !== 'string') text = require('util').inspect(text, { depth: 1 });

				text = text
					.replace(/`/g, '`' + String.fromCharCode(8203))
					.replace(/@/g, '@' + String.fromCharCode(8203));

				text = text.replaceAll(client.token, '[KODY NUKLEARNE NIE RUSZAĆ]');

				return text;
			};

			const colors = require('../utils/colors.json');
			const input = interaction.fields.getTextInputValue('code');
			try {
				const evaled = eval(input);
				const output = await clean(evaled, interaction.client);

				if (output.length > 1024) {
					const outtxt = new AttachmentBuilder(Buffer.from(output), { name: 'output.txt' });
					const embed = new EmbedBuilder()
						.setColor(colors.green)
						.addFields([
							{ name: 'Input', value: `\`\`\`js\n${input}\n\`\`\`` },
							{ name: 'Output', value: 'Output jest w załączonym pliku.' },
						]);
					await interaction.reply({ embeds: [embed], files: [outtxt] });
				}
				else {
					const embed = new EmbedBuilder()
						.setColor(colors.green)
						.addFields([
							{ name: 'Input', value: `\`\`\`js\n${input}\n\`\`\`` },
							{ name: 'Output', value: `\`\`\`xl\n${output}\n\`\`\`` },
						]);
					await interaction.reply({ embeds: [embed] });
				}
			}
			catch (error) {
				const embed = new EmbedBuilder()
					.setColor(colors.red)
					.addFields([
						{ name: 'Input', value: `\`\`\`js\n${input}\n\`\`\`` },
						{ name: 'Output', value: `\`\`\`xl\n${error}\n\`\`\`` },
					]);
				await interaction.reply({ embeds: [embed] });
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