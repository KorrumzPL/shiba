// TODO: napisz tą komendę inaczej jeśli możesz błagam i cafe.json też jakoś lepiej ogarnij

const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType, AttachmentBuilder, ButtonBuilder } = require('discord.js');
const cafe = require('../utils/cafe/cafe.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cafe')
		.setDescription('nom café'),

	async execute(interaction) {
		const menu = [];
		const things = Object.keys(cafe).filter(thing => !thing.includes('-'));
		things.forEach(thing => {
			return menu.push({
				label: cafe[thing],
				emoji: cafe[`${thing}-emoji`],
				description: cafe[`${thing}-desc`],
				value: thing,
			});
		});

		const select = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('cafe')
					.setPlaceholder('Wybierz coś sobie')
					.addOptions(menu),
			);

		await interaction.reply({ components: [select], fetchReply: true })
			.then(inter => {
				const filter = i => {
					if (i.user.id !== interaction.user.id) i.reply({ content: 'Ale to nie ty zamawiasz.', ephemeral: true });
					return i.user.id === interaction.user.id;
				};

				inter.awaitMessageComponent({ filter: filter, componentType: ComponentType.StringSelect, time: 20000 })
					.then(async i => {
						await i.update({ content: `Zamówienie od <@${i.user.id}> zostało przyjęte.`, components: [] });
						const attachment = new AttachmentBuilder().setFile(`src/utils/cafe/${i.values[0]}.png`);
						const action = new ActionRowBuilder()
							.addComponents(
								new ButtonBuilder()
									.setCustomId(i.values[0])
									.setLabel(cafe[`${i.values[0]}-use`])
									.setStyle('Primary'),
							);

						await i.followUp({ content: cafe[`${i.values[0]}-give`], files: [attachment], components: [action], fetchReply: true })
							.then(inter2 => {
								const filter2 = i2 => {
									if (i2.user.id !== interaction.user.id) i2.reply({ content: 'To nie twoje. Nie ruszaj tego!', ephemeral: true });
									return i2.user.id === interaction.user.id;
								};

								inter2.awaitMessageComponent({ filter: filter2, componentType: ComponentType.Button, time: 60000 })
									.then(async i2 => {
										await i2.update({ content: cafe[`${i2.customId}-using`].replace('[user]', `<@${i2.user.id}>`), components: [] });
										await i2.followUp({ content: cafe[`${i2.customId}-used`][Math.floor(Math.random() * cafe[`${i2.customId}-used`].length)] });
									})
									.catch(() => {
										action.components[0].setDisabled(true).setLabel('No i się przeterminowało').setStyle('Danger');
										inter2.edit({ components: [action] });
									});
							});
					})
					.catch(() => interaction.editReply({ content: 'Nie otrzymano żadnego zamówienia w 20 sekund.', components: [] }));
			});
	},
};
