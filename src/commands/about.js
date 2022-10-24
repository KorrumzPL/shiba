const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, Image, loadImage } = require('@napi-rs/canvas');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
const package = require(process.env.npm_package_json);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Informacje o Shibie'),

	async execute(interaction) {
		await interaction.deferReply();

		const canvas = createCanvas(1256, 512);
		const ctx = canvas.getContext('2d');
		const stats = new Image();

		let ziemniak;
		if (interaction.client.ws.ping > 200) ziemniak = await loadImage('src/utils/images/ziemniak_fire.png');
		else ziemniak = await loadImage('src/utils/images/ziemniak.png');

		ctx.fillStyle = '#36393E';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(stats, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(ziemniak, 750, 70, ziemniak.width / 1.5, ziemniak.height / 1.5);
		ctx.fillStyle = '#ffffff';
		ctx.textAlign = 'center';
		ctx.font = 'bold 32px Arial';
		ctx.fillText('Shiba', 150, 440);
		ctx.fillText('Node.js', 350, 440);
		ctx.fillText('discord.js', 550, 440);
		ctx.font = '32px Arial';
		ctx.fillText(`${process.env.npm_package_version}`, 150, 480);
		ctx.fillText(`${process.versions.node}`, 350, 480);
		ctx.fillText(`${package.dependencies['discord.js'].split('^').join('')}`, 550, 480);
		ctx.font = 'bold 48px Arial';
		ctx.fillText('Serwery', 150, 60);
		ctx.fillText('Użytkownicy', 450, 60);
		ctx.fillText('Ping', 750, 60);
		ctx.fillText('RAM', 200, 250);
		ctx.fillText('Uptime', 550, 250);
		ctx.font = '48px Arial';
		ctx.fillText(`${interaction.client.guilds.cache.size}`, 150, 120);
		ctx.fillText(`${interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`, 450, 120);
		ctx.fillText(`${interaction.client.ws.ping} ms`, 750, 120);
		ctx.fillText(`${Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100} MB`, 200, 310);
		ctx.fillText(`${dayjs.duration(interaction.client.uptime).format('D[d] H[h] m[m] s[s]')}`, 550, 310);

		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'statystyki.png' });

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Dodaj bota')
					.setEmoji('✅')
					.setStyle('Link')
					.setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.application.id}&permissions=${process.env.PERMISSIONS}&scope=bot`),
				new ButtonBuilder()
					.setLabel('Serwer bota')
					.setEmoji('👥')
					.setStyle('Link')
					.setURL(`https://discord.gg/${process.env.INVITE}`),
				new ButtonBuilder()
					.setLabel('GitHub')
					.setEmoji('💾')
					.setStyle('Link')
					.setURL(package.homepage),
			);

		await interaction.editReply({ components: [row], files: [attachment] });
	},
};