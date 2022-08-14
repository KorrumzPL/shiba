/* eslint-disable indent */
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

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
		),

	async execute(interaction) {
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case 'depresso': {
				if (dayjs().tz('Europe/Warsaw').hour() < 11 && dayjs().tz('Europe/Warsaw').hour() > 5) {
					const attachment = new AttachmentBuilder().setFile('src/utils/depresso.png');
					await interaction.editReply({ content: 'Proszę, oto twoja filiżanka depresso.', files: [attachment] });
				}
				else {
					await interaction.editReply('Depresso wydaję tylko między godziną 6 a 11.');
				}
				break;
			}
			case 'ciastko': {
				const attachment = new AttachmentBuilder().setFile('src/utils/ciastko.png');
				await interaction.editReply({ content: 'Proszę, oto ciastko dla ciebie.', files: [attachment] });
				break;
			}
		}
	},
};