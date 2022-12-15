// Szczerze to zamiast tej komendy lepiej by bylo coś innego zrobić. Może jakiś panel???

const { ActionRowBuilder, ModalBuilder, TextInputBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { prisma } = require('../utils/functions/client');
const { evaluate } = require('../utils/functions/evaluate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('owner')
		.setDescription('TYLKO DLA WŁAŚCICIELA BOTA')
		.addSubcommand(subcommand =>
			subcommand
				.setName('eval')
				.setDescription('Nie ruszaj tego, a nikomu nie stanie się krzywda'),
		)
		.addSubcommandGroup(subcommandgroup =>
			subcommandgroup
				.setName('activities')
				.setDescription('Zarządzanie aktywnościami bota')
				.addSubcommand(subcommand =>
					subcommand
						.setName('list')
						.setDescription('Lista aktywności'),
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName('add')
						.setDescription('Dodaje aktywność')
						.addStringOption(option => option.setName('name').setDescription('Treść aktywności').setRequired(true))
						.addStringOption(option => option.setName('type').setDescription('Typ aktywności').setRequired(true)),
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName('delete')
						.setDescription('Usuwa aktywność o danym ID')
						.addIntegerOption(option => option.setName('id').setDescription('ID aktywności').setRequired(true)),
				),
		),

	async execute(interaction) {
		if (interaction.user.id !== process.env.OWNER_ID) return await interaction.reply({ content: 'Czego ty tu niby chcesz? Nie ruszaj tego.', ephemeral: true });

		if (interaction.options.getSubcommandGroup() === null) {
			if (interaction.options.getSubcommand() === 'eval') {
				await interaction.editReply({ content: 'Oczekiwanie na eval...', components: [] });

				const code = new TextInputBuilder()
					.setCustomId('code')
					.setLabel('Wprowadź kod do wykonania')
					.setRequired(true)
					.setMaxLength(950)
					.setStyle('Paragraph');
				const actionRow = new ActionRowBuilder({ components: [code] });
				const modal = new ModalBuilder({ customId: 'eval', title: 'Wykonaj kod', components: [actionRow] });
				await interaction.showModal(modal);

				const submitted = await interaction.awaitModalSubmit({ time: 60000 }).catch(async () => {
					await interaction.editReply({ content: 'Przestano oczekiwać na eval.' });
				});

				if (submitted) {
					await evaluate(submitted, submitted.fields.getTextInputValue('code'));
				}
			}
		}
		else if (interaction.options.getSubcommandGroup() === 'activities') {
			if (interaction.options.getSubcommand() === 'list') {
				const activities = await prisma.activity.findMany({});
				let list = '';
				activities.forEach(activity => {
					return list = list + `ID: ${activity.id} | Nazwa: ${activity.name} | Typ: ${activity.type}\n`;
				});
				const output = new AttachmentBuilder(Buffer.from(list), { name: 'lista.txt' });
				await interaction.reply({ files: [output], ephemeral: true });
			}
			else if (interaction.options.getSubcommand() === 'add') {
				await prisma.activity.create({
					data: {
						name: interaction.options.getString('name'),
						type: interaction.options.getString('type'),
					},
				}).then(async () => {
					await interaction.reply({ content: 'Pomyślnie dodano nową aktywność.', ephemeral: true });
				}).catch(async err => {
					console.error(err);
					await interaction.reply({ content: 'Coś poszło nie tak. Błąd wypisano do konsoli.', ephemeral: true });
				});
			}
			else if (interaction.options.getSubcommand() === 'delete') {
				await prisma.activity.delete({
					where: {
						id: interaction.options.getInteger('id'),
					},
				}).then(async () => {
					await interaction.reply({ content: 'Pomyślnie usunięto aktywność.', ephemeral: true });
				}).catch(async err => {
					console.error(err);
					await interaction.reply({ content: 'Albo wpisałeś nieistniejące ID, albo coś poszło nie tak. Błąd wypisano do konsoli.', ephemeral: true });
				});
			}
		}
	},
};