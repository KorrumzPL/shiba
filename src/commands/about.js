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

		const guilds = `${interaction.client.guilds.cache.size}`;
		const users = `${interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`;
		const ping = `${interaction.client.ws.ping} ms`;
		const ram = `${Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100} MB`;
		const uptimeDuration = dayjs.duration(interaction.client.uptime);
		const uptime = `${Math.floor(uptimeDuration.asDays())}d ${uptimeDuration.format('H[h] m[m] s[s]')}`;

		const canvas = createCanvas(1256, 512);
		const ctx = canvas.getContext('2d');
		const stats = new Image();

		const fillAndStroke = (text, x, y) => {
			ctx.strokeText(text, x, y);
			ctx.fillText(text, x, y);
		};

		let ziemniak;
		if (interaction.client.ws.ping > 200) ziemniak = await loadImage('src/utils/images/ziemniak_fire.png');
		else ziemniak = await loadImage('src/utils/images/ziemniak.png');

		ctx.drawImage(stats, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(ziemniak, 750, 70, ziemniak.width / 1.5, ziemniak.height / 1.5);
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 4;
		ctx.textAlign = 'center';
		ctx.font = 'bold 32px Arial';
		fillAndStroke('Shiba', 150, 440);
		fillAndStroke('Node.js', 350, 440);
		fillAndStroke('discord.js', 550, 440);
		ctx.font = '32px Arial';
		fillAndStroke(`${process.env.npm_package_version}`, 150, 480);
		fillAndStroke(`${process.versions.node}`, 350, 480);
		fillAndStroke(`${package.dependencies['discord.js'].split('^').join('')}`, 550, 480);
		ctx.font = 'bold 48px Arial';
		fillAndStroke('Serwery', 150, 60);
		fillAndStroke('Użytkownicy', 450, 60);
		fillAndStroke('Ping', 750, 60);
		fillAndStroke('RAM', 200, 250);
		fillAndStroke('Uptime', 550, 250);
		ctx.font = '48px Arial';
		fillAndStroke(guilds, 150, 120);
		fillAndStroke(users, 450, 120);
		fillAndStroke(ping, 750, 120);
		fillAndStroke(ram, 200, 310);
		fillAndStroke(uptime, 550, 310);

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