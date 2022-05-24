const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('TYLKO DLA WŁAŚCICIELA BOTA'),
        
    async execute(interaction) {
        if (interaction.user.id !== process.env.OWNER_ID) {
            interaction.reply({ content: 'Wypierda- znaczy się oddal się w podskokach.', ephemeral: true });
            return;
        }
        
        const modal = new Modal({ customId: 'evalModal', title: '/eval' });
        const code = new TextInputComponent()
            .setCustomId('code')
            .setLabel('Wprowadź kod do wykonania')
            .setRequired(true)
            .setStyle('PARAGRAPH');
        const actionRow = new MessageActionRow().addComponents([code]);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    },
};