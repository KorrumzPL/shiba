const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('4fun')
        .setDescription('Głównie ciekawe pierdoły')
        .addSubcommand(subcommand =>
            subcommand
                .setName('dice')
                .setDescription('Losuje liczbę od 1 do 6')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('8ball')
                .setDescription('Odpowiada na zadane pytanie')
                .addStringOption(option => option.setName('pytanie').setDescription('Wprowadź swoje pytanie').setRequired(true))
        ),

        async execute(interaction) {
            switch (interaction.options.getSubcommand()) {
                case 'dice':
                    await interaction.reply(`Twoja wylosowana liczba to: **${Math.floor(Math.random() * 6) + 1}**`);
                    break;
                case '8ball':
                    const { odpowiedzi } = require('../utils/8ball.json')
                    await interaction.reply(`Pytanie: **${interaction.options.getString('pytanie')}**\nOdpowiedź: ${odpowiedzi[Math.floor(Math.random() * odpowiedzi.length)]}`);
                    break;
            }
        },
};