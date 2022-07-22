const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shiba')
		.setDescription('Losowe zdjęcie psa rasy Shiba Inu z r/shiba'),

	async execute(interaction) {
		await interaction.deferReply();
		await fetch('https://www.reddit.com/r/shiba.json?sort=new&limit=100')
			.then(res => res.json())
			.then(json => {
				const allowed = json.data.children.filter(post => post.data.url.includes('.jpg'));
				const randomPost = Math.floor(Math.random() * allowed.length);
				const embed = new EmbedBuilder()
					.setTitle(allowed[randomPost].data.title)
					.setImage(allowed[randomPost].data.url)
					.setURL(`https://reddit.com${allowed[randomPost].data.permalink}`);
				interaction.editReply({ embeds: [embed] });
			});
	},
};