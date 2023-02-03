const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const colors = require('../utils/strings/colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('counters')
		.setDescription('Liczniki wywołanych i błędnych komend'),

	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(colors.blue)
			.setTitle('Liczniki wywołanych komend')
			.setFields(
				{ name: 'Bez błędów', value: `${interaction.client.counters.commands}`, inline: true },
				{ name: 'Z błędami', value: `${interaction.client.counters.errors}`, inline: true },
			)
			.setFooter({ text: 'Liczniki są resetowane po każdym restarcie bota.' });
		await interaction.reply({ embeds: [embed] });
	},
};