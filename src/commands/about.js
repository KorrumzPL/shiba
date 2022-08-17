// embed zainspirowany komendą info z AmpersandBota (Ciach nie wkurwiaj się XD)

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
const package = require(process.env.npm_package_json);
const { stripIndent } = require('common-tags');
const colors = require('../utils/colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Informacje o Shibie'),

	async execute(interaction) {
		const used = process.memoryUsage().heapUsed / 1024 / 1024;
		const members = interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
		const days = Math.floor(interaction.client.uptime / 86400000);
		const hours = Math.floor(interaction.client.uptime / 3600000) % 24;
		const minutes = Math.floor(interaction.client.uptime / 60000) % 60;
		const seconds = Math.floor(interaction.client.uptime / 1000) % 60;

		const embed = new EmbedBuilder()
			.setColor(colors.blue)
			.setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.avatarURL() })
			.addFields([
				{ name: 'Wersje', value: stripIndent`
                    Shiba: **${process.env.npm_package_version}**
                    Node.js: **${process.versions.node}**
                    discord.js: **${package.dependencies['discord.js'].split('^').join('')}**
                `, inline: true },
				{ name: 'Statystyki', value: stripIndent`
                    Serwery / użytkownicy: **${interaction.client.guilds.cache.size} / ${members}**
                    Uptime: **${days}d, ${hours}h, ${minutes}m ${seconds}s**
                    Data utworzenia bota: **${dayjs.tz(interaction.client.user.createdAt, 'Europe/Warsaw').format('DD/MM/YYYY HH:mm:ss')}**
                `, inline: true },
				{ name: 'Techniczne', value: stripIndent`
                    Użycie pamięci RAM: **${Math.round(used * 100) / 100} MB**
                    Ping: **${interaction.client.ws.ping} ms**
                ` },
			])
			.setFooter({ text: 'Pij mleko, będziesz Nomzem.' });

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Zaproś bota')
					.setStyle('Link')
					.setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.application.id}&permissions=1644971949559&scope=bot`),
				new ButtonBuilder()
					.setLabel('Shiba Support')
					.setStyle('Link')
					.setURL('https://discord.gg/QJaXP6GqEy'),
				new ButtonBuilder()
					.setLabel('GitHub')
					.setStyle('Link')
					.setURL(package.homepage),
			);

		await interaction.reply({ embeds: [embed], components: [row] });
	},
};