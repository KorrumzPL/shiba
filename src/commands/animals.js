const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const colors = require('../utils/colors.json');
const { animals } = require('../utils/cache');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('animals')
		.setDescription('Losowe zdjęcia zwierząt')
		.addSubcommand(subcommand =>
			subcommand
				.setName('dog')
				.setDescription('Losowe zdjęcie psa'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('cat')
				.setDescription('Losowe zdjęcie kota'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('shiba')
				.setDescription('Losowe zdjęcie psa rasy Shiba Inu'),
		),

	async execute(interaction) {
		await interaction.deferReply();
		const image = animals.get(interaction.options.getSubcommand());
		const random = Math.floor(Math.random() * image.length);
		const embed = new EmbedBuilder()
			.setColor(colors.blue)
			.setTitle(image[random].title)
			.setImage(image[random].image)
			.setFooter({ text: `${image[random].sub} | Wynik: ${image[random].karma}` })
			.setURL(`https://reddit.com${image[random].link}`);
		await interaction.editReply({ embeds: [embed] });
	},
};