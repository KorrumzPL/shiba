const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, AttachmentBuilder, ButtonBuilder } = require('discord.js');
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
				description: cafe[`${thing}-desc`],
				value: `cafe-${thing}-${interaction.user.id}`,
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
				const collector = inter.createMessageComponentCollector({ time: 20000 });
				collector.on('collect', async i => {
					if (i.user.id !== interaction.user.id) return await i.reply({ content: 'Ale to nie ty zamawiasz.', ephemeral: true });
					await i.update({ content: `Zamówienie od <@${i.user.id}> zostało przyjęte.`, components: [] });
					const attachment = new AttachmentBuilder().setFile(`src/utils/cafe/${i.values[0].split('-')[1]}.png`);
					const action = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`cafe-${i.values[0].split('-')[1]}-${i.user.id}`)
								.setLabel(cafe[`${i.values[0].split('-')[1]}-use`])
								.setStyle('Primary'),
						);
					await i.followUp({ content: cafe[`${i.values[0].split('-')[1]}-give`], files: [attachment], tts: true, components: [action] });
					collector.stop();
				});
				collector.on('end', async (_collected, reason) => {
					if (reason === 'time') {
						await interaction.editReply({ content: 'Nie otrzymano żadnego zamówienia w 20 sekund.', components: [] });
					}
				});
			});
	},
};
