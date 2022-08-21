const { ActionRowBuilder, ModalBuilder, TextInputBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('TYLKO DLA WŁAŚCICIELA BOTA'),

	async execute(interaction) {
		if (interaction.user.id !== process.env.OWNER_ID) {
			interaction.reply({ content: 'Wypierda- znaczy się oddal się w podskokach.', ephemeral: true });
			return;
		}

		const modal = new ModalBuilder({ customId: 'eval', title: '/eval' });
		const code = new TextInputBuilder()
			.setCustomId('code')
			.setLabel('Wprowadź kod do wykonania')
			.setRequired(true)
			.setStyle('Paragraph');
		const actionRow = new ActionRowBuilder().addComponents([code]);
		modal.addComponents(actionRow);

		await interaction.showModal(modal);
	},
};