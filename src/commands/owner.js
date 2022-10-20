const { ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ComponentType, SlashCommandBuilder } = require('discord.js');
const { evaluate } = require('../utils/functions/evaluate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('owner')
		.setDescription('TYLKO DLA WŁAŚCICIELA BOTA'),

	async execute(interaction) {
		if (interaction.user.id !== process.env.OWNER_ID) return await interaction.reply({ content: 'Wypierda- znaczy się oddal się w podskokach.', ephemeral: true });

		const actions = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('eval')
					.setLabel('Wykonaj kod')
					.setStyle('Primary'),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('addactivity')
					.setLabel('Dodaj aktywność')
					.setStyle('Success'),
			);

		await interaction.reply({ content: 'Witaj Nomziu.', components: [actions], fetchReply: true })
			.then(inter => {
				const collector = inter.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
				collector.on('collect', async i => {
					if (i.user.id !== process.env.OWNER_ID) return await i.reply({ content: 'nie.', ephemeral: true });
					switch (i.customId) {
					case 'eval': {
						collector.stop();
						await interaction.editReply({ content: 'Oczekiwanie na eval...', components: [] });

						const modal = new ModalBuilder({ customId: 'eval', title: 'Wykonaj kod' });
						const code = new TextInputBuilder()
							.setCustomId('code')
							.setLabel('Wprowadź kod do wykonania')
							.setRequired(true)
							.setMaxLength(950)
							.setStyle('Paragraph');
						const actionRow = new ActionRowBuilder().addComponents(code);
						modal.addComponents(actionRow);
						await i.showModal(modal);

						const submitted = await interaction.awaitModalSubmit({ time: 60000 }).catch(() => {
							interaction.editReply({ content: 'Przestano oczekiwać na eval.' });
						});

						if (submitted) {
							await evaluate(submitted, submitted.fields.getTextInputValue('code'));
						}
						break;
					}
					case 'addactivity': {
						collector.stop();
						await interaction.editReply({ content: 'Oczekiwanie na nową aktywność...', components: [] });

						const modal = new ModalBuilder({ customId: 'addactivity', title: 'Dodaj aktywność' });
						const type = new TextInputBuilder()
							.setCustomId('type')
							.setLabel('Typ aktywności')
							.setRequired(true)
							.setPlaceholder('Game | Watching | Listening')
							.setStyle('Short');
						const content = new TextInputBuilder()
							.setCustomId('content')
							.setLabel('Treść aktywności')
							.setRequired(true)
							.setStyle('Short');
						const firstActionRow = new ActionRowBuilder().addComponents(type);
						const secondActionRow = new ActionRowBuilder().addComponents(content);
						modal.addComponents(firstActionRow, secondActionRow);
						await i.showModal(modal);

						const submitted = await interaction.awaitModalSubmit({ time: 60000 }).catch(() => {
							interaction.editReply('Przestano oczekiwać na nową aktywność.');
						});

						if (submitted) {
							const fs = require('fs');
							const file = 'src/utils/strings/activities.json';

							fs.readFile(file, async (error, data) => {
								if (error) throw error;
								const activities = JSON.parse(data);
								try {
									activities[submitted.fields.getTextInputValue('type')].push(submitted.fields.getTextInputValue('content'));
								}
								catch (err) {
									await submitted.update('Coś nie pykło. Czy wpisałeś wszystko poprawnie?');
									return;
								}
								fs.writeFile(file, JSON.stringify(activities, null, 4), async (err) => {
									if (err) throw err;
									await submitted.update('Dodano aktywność.');
								});
							});
						}
						break;
					}
					}
				});
				collector.on('end', async (_collected, reason) => {
					if (reason === 'time') {
						await interaction.editReply({ content: 'Do zobaczenia Nomziu.', components: [] });
					}
				});
			});
	},
};