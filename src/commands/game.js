const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('game')
		.setDescription('Zagraj w coś')
		.addSubcommand(subcommand =>
			subcommand
				.setName('rockpaperscissors')
				.setDescription('Zagraj z kimś w papier, kamień, nożyce')
				.addUserOption(option => option.setName('osoba').setDescription('Osoba z którą chcesz zagrać').setRequired(true)),
		),

	async execute(interaction) {
		switch (interaction.options.getSubcommand()) {
		case 'rockpaperscissors': {
			if (interaction.options.getUser('osoba').bot) return await interaction.reply({ content: 'Nie możesz rozpocząć gry z botem!', ephemeral: true });
			else if (interaction.user.id === interaction.options.getUser('osoba').id) return await interaction.reply({ content: 'Nie możesz grać z samym sobą!', ephemeral: true });
			await require('../utils/games/rps.js').rps(interaction);
			break;
		}
		}
	},
};