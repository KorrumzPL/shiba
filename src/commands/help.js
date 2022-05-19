const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Informacje o Shibie'),
    async execute(interaction) {
        await interaction.reply('Siema. To jest (kolejny) rewrite Shiby (w końcu kurwaaaaaaa).');
    },
};