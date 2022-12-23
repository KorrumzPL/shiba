const { SlashCommandBuilder, AttachmentBuilder, ComponentType, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { createCanvas, Image, loadImage } = require('@napi-rs/canvas');
const date = new Date();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('christmas')
		.setDescription('Komendy na Boże Narodzenie')
		.addSubcommand(subcommand =>
			subcommand
				.setName('prezent')
				.setDescription('Wręcz komuś prezent (dostępne od 24 do 26 grudnia)')
				.addUserOption(option => option.setName('osoba').setDescription('Osoba której chcesz wręczyć prezent').setRequired(true))
				.addIntegerOption(option => option.setName('prezent').setDescription('Prezent do wręczenia').setRequired(true).setChoices(
					{ name: 'Paczka cukierków Kinder', value: 0 },
					{ name: 'Rózga', value: 1 },
					{ name: 'Kubek', value: 2 },
					{ name: 'Ciachstko', value: 3 },
					{ name: 'Świąteczna nom cola', value: 4 },
					{ name: 'Granatnik RGW-90', value: 5 },
					{ name: 'JBL Charge 4', value: 6 },
					{ name: 'Prezent z bombą', value: 7 },
					{ name: '10 kg węgla', value: 8 },
					// dzięki lisia i oskarghi za egzotyczne masła
					{ name: 'Egzotyczne masła', value: 9 },
					{ name: 'Mandarynki', value: 10 },
				)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('oplatek')
				.setDescription('Podziel się z kimś opłatkiem (dostępne od 24 do 26 grudnia)')
				.addUserOption(option => option.setName('osoba').setDescription('Osoba z którą chcesz podzielić się opłatkiem').setRequired(true))
				.addStringOption(option => option.setName('zyczenia').setDescription('Życzenia do osoby z którą dzielisz się opłatkiem').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
			// dzięki za pomysł slavista
				.setName('usmaz-karpia')
				.setDescription('Spróbuj usmażyć karpia'),
		),

	async execute(interaction) {
		switch (interaction.options.getSubcommand()) {
		case 'prezent': {
			if (interaction.user.id === interaction.options.getUser('osoba').id) return await interaction.reply('Gratuluję, wręczyłeś(-aś) prezent samemu(-ej) sobie.');
			if (date.getDate() < 24) return await interaction.reply('Poczekaj do 24 grudnia, nie mam nawet jeszcze co rozdawać.');
			if (date.getDate() > 26) return await interaction.reply('Wszystkie prezenty zostały już rozdane ¯\\_(ツ)_/¯');

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setLabel('Otwórz prezent')
						.setEmoji('🎁')
						.setStyle('Primary')
						.setCustomId('open'),
				);

			await interaction.reply({
				allowedMentions: { parse: ['users'] },
				components: [row],
				content: `<@${interaction.options.getUser('osoba').id}>, otrzymałeś prezent od <@${interaction.user.id}>!`,
				fetchReply: true,
			}).then(inter => {
				const filter = i => {
					if (i.user.id !== interaction.options.getUser('osoba').id) i.reply({ content: 'To nie prezent dla ciebie. Nie dotykaj.', ephemeral: true });
					return i.user.id === interaction.options.getUser('osoba').id;
				};

				inter.awaitMessageComponent({ filter: filter, componentType: ComponentType.Button, time: 900000 })
					.then(async i => {
						await i.deferUpdate();
						const { prezent } = require('../utils/strings/replies.json');
						const attachment = new AttachmentBuilder();
						// profesjonalny workaround do jednego gifa (discord nie odpala apng i nie mam lepszego pomysłu)
						if (interaction.options.getInteger('prezent') === 7) attachment.setFile('src/utils/images/prezenty/7.gif');
						else attachment.setFile(`src/utils/images/prezenty/${interaction.options.getInteger('prezent')}.png`);
						await inter.edit({ content: `Otworzyłeś(-aś) prezent od <@${interaction.user.id}>. ${prezent[interaction.options.getInteger('prezent')].replace('[user]', `<@${interaction.user.id}>`)}`, components: [], files: [attachment] });
					})
					.catch(async () => {
						row.components[0].setDisabled(true).setLabel('dobra za długo czekam nie dostaniesz prezentu').setStyle('Danger');
						await inter.edit({ components: [row] });
					});
			});

			break;
		}
		case 'oplatek': {
			if (interaction.user.id === interaction.options.getUser('osoba').id) return await interaction.reply('Złożyłeś(-aś) sobie samemu(-ej) życzenia i podzieliłeś(-aś) się opłatkiem z samym(-ą) sobą. Smutne.');
			if (date.getDate() < 24) return await interaction.reply('Poczekaj do 24 grudnia, jeszcze opłatków nie kupiłem nawet...');
			if (date.getDate() > 26) return await interaction.reply('Opłatki mi się skończyły. ~~Wszystkie zjadłem.~~');

			await interaction.deferReply();

			const avatars = [
				await loadImage(interaction.user.displayAvatarURL()),
				await loadImage(interaction.options.getUser('osoba').displayAvatarURL()),
			];
			const canvas = createCanvas(600, 200);
			const ctx = canvas.getContext('2d');
			const image = new Image();
			ctx.fillStyle = '#d5d7c2';
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
			ctx.fillRect(250, 30, 6 * 14, 11 * 14);
			ctx.drawImage(avatars[0], 0, 0, 200, 200);
			ctx.drawImage(avatars[1], 400, 0, 200, 200);

			const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'oplatek.png' });
			await interaction.editReply({
				allowedMentions: { parse: ['users'] },
				files: [attachment],
				content: `*<@${interaction.user.id}> dzieli się opłatkiem z <@${interaction.options.getUser('osoba').id}>*\nŻyczenia od ${interaction.user.username}: "${interaction.options.getString('zyczenia')}"`,
			});
			break;
		}
		case 'usmaz-karpia': {
			await interaction.deferReply();
			const karpie = [
				{ name: 'Eeeeeee...', link: 'https://nomz.ct8.pl/pliki/karp.mp4' },
				{ name: 'Udało ci się usmażyć karpia :clap:', link: 'https://nomz.ct8.pl/pliki/karp-smazony.png' },
				{ name: 'Spaliłeś(-aś) karpia.', link: 'https://nomz.ct8.pl/pliki/spalony-karp.png' },
			];
			const random = Math.floor(Math.random() * karpie.length);
			const attachment = new AttachmentBuilder().setFile(karpie[random].link);
			await interaction.editReply({ files: [attachment], content: karpie[random].name });
			break;
		}
		}
	},
};