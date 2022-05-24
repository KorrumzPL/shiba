// embed zainspirowany komendą info z AmpersandBota (Ciach nie wkurwiaj się XD)

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const os = require('node:os');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc);
dayjs.extend(timezone);
const package = require(process.env.npm_package_json);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Informacje o Shibie'),
        
    async execute(interaction) {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        const members = interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
        const days = Math.floor(interaction.client.uptime / 86400000);
        const hours = Math.floor(interaction.client.uptime / 3600000) % 24;
        const minutes = Math.floor(interaction.client.uptime / 60000) % 60;
        const seconds = Math.floor(interaction.client.uptime / 1000) % 60;

        const embed = new MessageEmbed()
            .setColor("#0094d4")
            .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.avatarURL() })
            .addField('Wersje', `
Shiba: **${process.env.npm_package_version}**
Node.js: **${process.versions.node}**
discord.js: **${package.dependencies['discord.js'].split('^').join('')}**
            `, true)
            .addField('Statystyki', `
Serwery / użytkownicy: **${interaction.client.guilds.cache.size} / ${members}**
Uptime: **${days}d, ${hours}h, ${minutes}m ${seconds}s**
Data utworzenia bota: **${dayjs.tz(interaction.client.user.createdAt, 'Europe/Warsaw').format('DD/MM/YYYY HH:mm:ss')}**
            `, true)
            .addField('Techniczne', `
Typ i wersja systemu: **${os.type()} ${os.release()}**
Użycie pamięci RAM: **${Math.round(used * 100) / 100} MB**
Ping: **${interaction.client.ws.ping} ms**
            `)
            .setFooter({ text: `zalałem czujnik gazu. jebnął ledwo po tym jak wyłączyłem alarm. zajebiście się czuję ogółem.` });
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Zaproś bota')
                    .setStyle('LINK')
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.application.id}&permissions=1644971949559&scope=bot%20applications.commands`),
                    new MessageButton()
                    .setLabel('Zaproś bota (admin)')
                    .setStyle('LINK')
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.application.id}&permissions=8&scope=bot%20applications.commands`),
                new MessageButton()
                    .setLabel('GitHub')
                    .setStyle('LINK')
                    .setURL(package.homepage.split('#readme').join(''))
            );

        await interaction.reply({ embeds: [embed], components: [row], content: `Siema. To jest (kolejny) rewrite Shiby (w końcu).` });
    },
};