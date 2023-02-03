const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { eightball, rape, motivate } = require('../utils/strings/replies.json');
const dayjs = require('dayjs');
const { createCanvas, Image } = require('@napi-rs/canvas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fun')
		.setDescription('Głównie ciekawe pierdoły')
		.addSubcommand(subcommand =>
			subcommand
				.setName('dice')
				.setDescription('Losuje liczbę od 1 do 6, albo liczbę z podanego przedziału')
				.addIntegerOption(option => option.setName('min').setDescription('Najniższa liczba do wylosowania').setRequired(false))
				.addIntegerOption(option => option.setName('max').setDescription('Najwyższa liczba do wylosowania').setRequired(false)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('8ball')
				.setDescription('Odpowiada na zadane pytanie')
				.addStringOption(option => option.setName('pytanie').setDescription('Wprowadź swoje pytanie').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('cock')
				.setDescription('Losuje długość twojego sam wiesz czego'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ship')
				.setDescription('Losuje na ile procent podane osoby do siebie pasują')
				.addUserOption(option => option.setName('osoba1').setDescription('Podaj dowolnego użytkownika').setRequired(true))
				.addUserOption(option => option.setName('osoba2').setDescription('Podaj dowolnego użytkownika').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('zgon')
				.setDescription('Generuje akt zgonu danego użytkownika')
				.addUserOption(option => option.setName('martwy').setDescription('Podaj dowolnego użytkownika').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('rape')
				.setDescription('Kolega prosił o tą komendę. Nie pytaj.')
				.addUserOption(option => option.setName('osoba').setDescription('Podaj dowolnego użytkownika').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('awesomecar')
				.setDescription('Losowe auto z https://awesomecars.neocities.org'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('motivate')
				.setDescription('Wysyła (niezbyt) motywującą wiadomość'),
		),

	async execute(interaction) {
		switch (interaction.options.getSubcommand()) {
		case 'dice': {
			if (interaction.options.getInteger('min') && interaction.options.getInteger('max')) {
				await interaction.reply(`Wylosowałeś liczbę: ${Math.floor(Math.random() * (interaction.options.getInteger('max') - interaction.options.getInteger('min') + 1)) + interaction.options.getInteger('min')}`);
			}
			else {
				await interaction.reply(`Wylosowałeś liczbę: ${Math.floor(Math.random() * 6) + 1}`);
			}
			break;
		}
		case '8ball': {
			await interaction.reply(`Pytanie: **${interaction.options.getString('pytanie')}**\nOdpowiedź: ${eightball[Math.floor(Math.random() * eightball.length)]}`);
			break;
		}
		case 'cock': {
			await interaction.reply(`Twoja długość "koguta" wynosi ${Math.floor(Math.random() * 25) + 1} cm.`);
			break;
		}
		case 'ship': {
			await interaction.reply(`${interaction.options.getUser('osoba1')} i ${interaction.options.getUser('osoba2')} pasują do siebie na ${Math.floor(Math.random() * 100) + 1}%.`);
			break;
		}
		case 'zgon': {
			await interaction.deferReply();

			const applyText = (canvas, text) => {
				const context = canvas.getContext('2d');
				let fontSize = 80;
				do {
					context.font = `${fontSize -= 10}px Comic Sans MS`;
				} while (context.measureText(text).width > canvas.width);
				return context.font;
			};

			const canvas = createCanvas(794, 1123);
			const ctx = canvas.getContext('2d');
			const akt = new Image();

			// https://twitter.com/TygodnikNIE/status/1549299100310462464
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, 794, 1123);
			ctx.drawImage(akt, 0, 0, canvas.width, canvas.height);
			ctx.textAlign = 'center';
			ctx.fillStyle = '#000000';
			ctx.font = 'bold 48px Comic Sans MS';
			ctx.fillText('ALBAŃSKI AKT ZGONU', 397, 100);
			ctx.font = '48px Comic Sans MS';
			ctx.fillText(`Dnia ${dayjs().format('DD.MM.YYYY')} r. wziął i umarł`, 397, 400);
			ctx.font = applyText(canvas, interaction.options.getUser('martwy').tag);
			ctx.fillText(interaction.options.getUser('martwy').tag, 397, 550);
			ctx.font = '40px Comic Sans MS';
			ctx.fillText('Zatwierdzam', 397, 900);
			ctx.font = '50px Comic Sans MS';
			ctx.fillText('Shiba Nomzowski', 397, 1000);

			const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'akt_zgonu.png' });
			await interaction.editReply({ files: [attachment] });
			break;
		}
		case 'rape': {
			await interaction.reply(rape[Math.floor(Math.random() * rape.length)].replace('[serwer]', interaction.guild.name));
			break;
		}
		case 'awesomecar': {
			await interaction.reply(`https://awesomecars.neocities.org/ver2/${Math.floor(Math.random() * 1927) + 1}.mp4`);
			break;
		}
		case 'motivate': {
			await interaction.reply(motivate[Math.floor(Math.random() * motivate.length)]);
			break;
		}
		}
	},
};
