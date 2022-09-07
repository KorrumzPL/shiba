const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('game')
		.setDescription('Zagraj w coś')
		.addSubcommand(subcommand =>
			subcommand
				.setName('rock_paper_scissors')
				.setDescription('Zagraj z kimś w papier, kamień, nożyce')
				.addUserOption(option => option.setName('osoba').setDescription('Osoba z którą chcesz zagrać').setRequired(true)),
		),

	async execute(interaction) {
		await require(`../utils/games/${interaction.options.getSubcommand()}`)[interaction.options.getSubcommand()](interaction);
	},
};