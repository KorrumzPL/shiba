/* eslint-disable no-prototype-builtins */
const { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

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
				.setName('rockpaperscissors')
				.setDescription('Zagraj z kimś w papier, kamień, nożyce')
				.addUserOption(option => option.setName('osoba').setDescription('Osoba z którą chcesz zagrać').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('rape')
				.setDescription('Kolega prosił o tą komendę. Nie pytaj.')
				.addUserOption(option => option.setName('osoba').setDescription('Podaj dowolnego użytkownika').setRequired(true)),
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
			const { eightball } = require('../utils/replies.json');
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
			const dayjs = require('dayjs');
			const Canvas = require('@napi-rs/canvas');
			const canvas = Canvas.createCanvas(794, 1123);
			const ctx = canvas.getContext('2d');
			const akt = new Canvas.Image();

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
			ctx.font = '60px Comic Sans MS';
			ctx.fillText(interaction.options.getUser('martwy').tag, 397, 550);
			ctx.font = '32px Comic Sans MS';
			ctx.fillText('Zatwierdzam', 590, 900);
			ctx.font = '40px Comic Sans MS';
			ctx.fillText('Shiba Nomzowski', 590, 1000);

			const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'akt_zgonu.png' });
			await interaction.editReply({ files: [attachment] });
			break;
		}
		case 'rockpaperscissors': {
			if (interaction.options.getUser('osoba').bot) return await interaction.reply({ content: 'Nie możesz rozpocząć gry z botem!', ephemeral: true });
			else if (interaction.user.id === interaction.options.getUser('osoba').id) return await interaction.reply({ content: 'Nie możesz grać z samym sobą!', ephemeral: true });

			const gamers = [interaction.user.id, interaction.options.getUser('osoba').id];
			const emojis = {
				'rock': '🪨',
				'paper': '📄',
				'scissors': '✂️',
			};
			const choices = new Object();
			const buttons = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('rock')
						.setEmoji(emojis.rock)
						.setStyle('Danger'),
					new ButtonBuilder()
						.setCustomId('paper')
						.setEmoji(emojis.paper)
						.setStyle('Success'),
					new ButtonBuilder()
						.setCustomId('scissors')
						.setEmoji(emojis.scissors)
						.setStyle('Secondary'),
				);

			const winner = () => {
				const winner0 = `**Zwycięzca: <@${gamers[0]}>**`;
				const winner1 = `**Zwycięzca: <@${gamers[1]}>**`;

				if (choices[gamers[0]] === choices[gamers[1]]) {
					return '**Remis.**';
				}
				else if (choices[gamers[0]] === 'paper') {
					if (choices[gamers[1]] === 'rock') {
						return winner0;
					}
					else if (choices[gamers[1]] === 'scissors') {
						return winner1;
					}
				}
				else if (choices[gamers[0]] === 'rock') {
					if (choices[gamers[1]] === 'scissors') {
						return winner0;
					}
					else if (choices[gamers[1]] === 'paper') {
						return winner1;
					}
				}
				else if (choices[gamers[0]] === 'scissors') {
					if (choices[gamers[1]] === 'paper') {
						return winner0;
					}
					else if (choices[gamers[1]] === 'rock') {
						return winner1;
					}
				}
			};

			await interaction.reply({ content: `<@${gamers[0]}> rozpoczął grę z <@${gamers[1]}>. Macie 15 sekund na wybór.`, components: [buttons], allowedMentions: { users: [gamers[1]] }, fetchReply: true })
				.then(inter => {
					const collector = inter.createMessageComponentCollector({ time: 15000 });
					collector.on('collect', async i => {
						if (!gamers.includes(i.user.id)) return await i.reply({ content: 'Ale ty przecież nie grasz.', ephemeral: true });
						else if (choices.hasOwnProperty(i.user.id)) return await i.reply({ content: 'Dokonałeś już wyboru.', ephemeral: true });

						choices[i.user.id] = i.customId;
						if (Object.keys(choices).length === 2) {
							await i.update({ content: `<@${gamers[0]}> wybrał(a) ${emojis[choices[gamers[0]]]}\n<@${gamers[1]}> wybrał(a) ${emojis[choices[gamers[1]]]}\n\n${winner()}`, components: [] });
							collector.stop();
						}
						else {
							await i.update({ content: `<@${i.user.id}> dokonał wyboru. Czekam na drugiego gracza...` });
						}
					});
					collector.on('end', async (_collected, reason) => {
						if (reason === 'time') {
							await interaction.editReply({ content: 'Jeden z graczy nie dokonał wyboru na czas.', components: [] }).catch(console.error);
						}
					});
				});
			break;
		}
		case 'rape': {
			const { rape } = require('../utils/replies.json');
			await interaction.reply(rape[Math.floor(Math.random() * rape.length)].replace('[serwer]', interaction.guild.name));
			break;
		}
		}
	},
};
