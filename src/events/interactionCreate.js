const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Modal do komemdy eval
        if (interaction.isModalSubmit()) {
            const toEval = interaction.fields.getTextInputValue('code');
            try {
                const evaled = eval(toEval);
                let embed = new MessageEmbed()
                    .setColor('#00ff00')
                    .addField('Input', `\`\`\`js\n${toEval}\n\`\`\``)
                    .addField('Output', `\`\`\`xl\n${evaled}\n\`\`\``);
                interaction.reply({ embeds: [embed] });
            } catch (error) {
                let embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .addField('Input', `\`\`\`js\n${toEval}\n\`\`\``)
                    .addField('Output', `\`\`\`xl\n${error}\n\`\`\``);
                interaction.reply({ embeds: [embed] });
            }
            return;
        }

        // Komendy
        if (!interaction.isCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Wystąpił błąd podczas wykonywania komendy.', ephemeral: true });
        }
    },
};