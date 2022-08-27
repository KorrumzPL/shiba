// embed zainspirowany komendą info z AmpersandBota (Ciach nie wkurwiaj się XD)

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, ComponentType } = require('discord.js');
const { stripIndent } = require('common-tags');
const package = require(process.env.npm_package_json);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Informacje o Shibie'),

	async execute(interaction) {
		const stats = async () => {
			const colors = require('../utils/colors.json');
			const dayjs = require('dayjs');
			const utc = require('dayjs/plugin/utc');
			const timezone = require('dayjs/plugin/timezone');
			dayjs.extend(utc);
			dayjs.extend(timezone);

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
					` },
					{ name: 'Statystyki', value: stripIndent`
						Serwery / użytkownicy: **${interaction.client.guilds.cache.size} / ${members}**
						Data utworzenia bota: **${dayjs.tz(interaction.client.user.createdAt, 'Europe/Warsaw').format('DD/MM/YYYY HH:mm:ss')}**
					` },
					{ name: 'Działanie bota', value: stripIndent`
						Uptime: **${days}d, ${hours}h, ${minutes}m ${seconds}s**
						Ping: **${interaction.client.ws.ping} ms**
					` },
				]);
			return await interaction.editReply({ content: '', components: [], embeds: [embed] });
		};

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Statystyki')
					.setStyle('Primary')
					.setCustomId('stats'),
				new ButtonBuilder()
					.setLabel('Zaproś bota')
					.setEmoji('✅')
					.setStyle('Link')
					.setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.application.id}&permissions=1644971949559&scope=bot`),
				new ButtonBuilder()
					.setLabel('Shiba Support')
					.setEmoji('👥')
					.setStyle('Link')
					.setURL('https://discord.gg/QJaXP6GqEy'),
				new ButtonBuilder()
					.setLabel('GitHub')
					.setEmoji('💾')
					.setStyle('Link')
					.setURL(package.homepage),
			);

		await interaction.reply({ content: 'Siema. Jestem Shiba.', components: [row], fetchReply: true })
			.then(inter => {
				const filter = i => {
					i.deferUpdate();
					return i.user.id === interaction.user.id;
				};

				inter.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 20000 })
					.then(async () => await stats())
					.catch(() => {
						row.components[0].setDisabled(true);
						interaction.editReply({ components: [row] });
					});
			});
	},
};