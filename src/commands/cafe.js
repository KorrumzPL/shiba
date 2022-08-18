/* eslint-disable indent */
const { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const cafe = require('../utils/cafe/cafe.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cafe')
		.setDescription('nom café')
		.addSubcommand(subcommand =>
			subcommand
				.setName('depresso')
				.setDescription('Poproś bota o filiżankę depresso'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ciastko')
				.setDescription('Poproś bota o ciastko'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('cola')
				.setDescription('Poproś bota o colę'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('bagietka')
				.setDescription('Poproś bota o bagietkę'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('kremówka')
				.setDescription('Poproś bota o kremówka'),
		),

	async execute(interaction) {
		await interaction.deferReply();
		const attachment = new AttachmentBuilder().setFile(`src/utils/cafe/${interaction.options.getSubcommand()}.png`);
		const action = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(interaction.options.getSubcommand())
					.setLabel(cafe[`${interaction.options.getSubcommand()}0`])
					.setStyle('Primary'),
			);
		await interaction.editReply({ files: [attachment] });
		await interaction.followUp({ content: cafe[interaction.options.getSubcommand()], tts: true, components: [action] });
	},
};