const { ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ComponentType, SlashCommandBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('owner')
		.setDescription('TYLKO DLA WŁAŚCICIELA BOTA'),

	async execute(interaction) {
		if (interaction.user.id !== process.env.OWNER_ID) return await interaction.reply({ content: 'Czego ty tu niby chcesz? Nie ruszaj tego.', ephemeral: true });

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
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('delactivity')
					.setLabel('Usuń aktywność')
					.setStyle('Danger'),
			);

		await interaction.reply({ content: 'Witaj Nomziu.', components: [actions], fetchReply: true })
			.then(inter => {
				const collector = inter.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
				collector.on('collect', async i => {
					if (i.user.id !== process.env.OWNER_ID) return await i.reply({ content: 'nie.', ephemeral: true });
					collector.stop();
					switch (i.customId) {
					case 'eval': {
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
							const { evaluate } = require('../utils/functions/evaluate');
							await evaluate(submitted, submitted.fields.getTextInputValue('code'));
						}
						break;
					}
					case 'addactivity': {
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
							const { prisma } = require('../utils/functions/client');
							await prisma.activity.create({
								data: {
									name: submitted.fields.getTextInputValue('content'),
									type: submitted.fields.getTextInputValue('type'),
								},
							}).then(async () => {
								await submitted.update('Pomyślnie dodano nową aktywność.');
							}).catch(async err => {
								console.error(err);
								await submitted.update('Coś poszło nie tak. Sprawdź lepiej logi szybko.');
							});
						}
						break;
					}
					case 'delactivity': {
						const { prisma } = require('../utils/functions/client');
						const activities = await prisma.activity.findMany();
						const menu = [];
						const things = activities;
						things.forEach(thing => {
							return menu.push({
								label: thing.name,
								description: `ID: ${thing.id} | Typ: ${thing.type}`,
								value: `${thing.id}`,
							});
						});
						const select = new ActionRowBuilder()
							.addComponents(
								new SelectMenuBuilder()
									.setCustomId('delactivity')
									.setPlaceholder('Wybierz aktywność do skasowania')
									.addOptions(menu),
							);
						await interaction.editReply({ content: '', components: [select], fetchReply: true }).then(inter2 => {
							const filter2 = i2 => {
								if (i2.user.id !== interaction.user.id) i2.deferUpdate();
								return i2.user.id === interaction.user.id;
							};

							inter2.awaitMessageComponent({ filter: filter2, componentType: ComponentType.StringSelect, time: 5000 })
								.then(async i2 => {
									await prisma.activity.delete({ where: { id: parseInt(i2.values[0]) } });
									await i2.update({ content: 'Pomyślnie usunięto aktywność.', components: [] });
								})
								.catch(async err => {
									console.error(err);
									await interaction.editReply({ content: 'Nie wybrano żadnej aktywności do skasowania, albo wystąpił błąd.', components: [] });
								});
						});
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