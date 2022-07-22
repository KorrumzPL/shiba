/* eslint-disable indent */
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const colors = require('../utils/colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('4fun')
		.setDescription('Głównie ciekawe pierdoły')
		.addSubcommand(subcommand =>
			subcommand
				.setName('dice')
				.setDescription('Losuje liczbę od 1 do 6'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('8ball')
				.setDescription('Odpowiada na zadane pytanie')
				.addStringOption(option => option.setName('pytanie').setDescription('Wprowadź swoje pytanie').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('experiments')
				.setDescription('Czekaj kurde... ale to nie powinno być w 4fun?'),
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
				.setName('depresso')
				.setDescription('Poproś bota o filiżankę depresso'),
		),

	async execute(interaction) {
		switch (interaction.options.getSubcommand()) {
			case 'dice': {
				await interaction.reply(`Twoja wylosowana liczba to: ${Math.floor(Math.random() * 6) + 1}`);
				break;
			}
			case '8ball': {
				const { odpowiedzi } = require('../utils/8ball.json');
				await interaction.reply(`Pytanie: **${interaction.options.getString('pytanie')}**\nOdpowiedź: ${odpowiedzi[Math.floor(Math.random() * odpowiedzi.length)]}`);
				break;
			}
			case 'experiments': {
				const yyy = '```js\nObject.defineProperty((webpackChunkdiscord_app.push([[\'\'],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.isDeveloper!==void 0).exports.default,"isDeveloper",{get:()=>true});\n```';
				const embed = new EmbedBuilder()
					.setColor(colors.blue)
					.setDescription(yyy)
					.setFooter({ text: 'https://gist.github.com/ExampleWasTaken/44ebdb4ac5980760ae8ebfbf995c5390' });
				await interaction.reply({ embeds: [embed] });
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
			case 'depresso': {
				const dayjs = require('dayjs');
				const utc = require('dayjs/plugin/utc');
				const timezone = require('dayjs/plugin/timezone');
				dayjs.extend(utc);
				dayjs.extend(timezone);

				if (dayjs().tz('Europe/Warsaw').hour() > 11 || dayjs().tz('Europe/Warsaw').hour() > 6) {
					await interaction.reply('Depresso wydaję tylko między godziną 6 a 11.');
				}
				else {
					const attachment = new AttachmentBuilder().setFile('https://nomz.ct8.pl/pliki/depresso.png');
					await interaction.reply({ content: 'Proszę, oto twoja filiżanka depresso.', tts: true, files: [attachment] });
				}
				break;
			}
		}
	},
};