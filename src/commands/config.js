const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const colors = require('../utils/colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Konfiguracja bota'),

	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(colors.blue)
			.setTitle(':wrench:  Konfiguracja bota')
			.setDescription('Tu jeszcze nic nie ma (ale będzie).');

		await interaction.reply({ embeds: [embed] });
	},
};