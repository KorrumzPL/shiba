const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Konfiguracja bota'),

	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor('#0094d4')
			.setTitle(':wrench:  Konfiguracja bota')
			.setDescription('Tu jeszcze nic nie ma (ale będzie).');

		await interaction.reply({ embeds: [embed] });
	},
};