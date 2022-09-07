const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

const rock_paper_scissors = async (interaction) => {
	if (interaction.options.getUser('osoba').bot) return await interaction.reply({ content: 'Nie możesz rozpocząć gry z botem!', ephemeral: true });
	else if (interaction.user.id === interaction.options.getUser('osoba').id) return await interaction.reply({ content: 'Nie możesz grać z samym sobą!', ephemeral: true });

	const players = [interaction.user.id, interaction.options.getUser('osoba').id];
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
				.setLabel('Kamień')
				.setEmoji(emojis.rock)
				.setStyle('Danger'),
			new ButtonBuilder()
				.setCustomId('paper')
				.setLabel('Papier')
				.setEmoji(emojis.paper)
				.setStyle('Success'),
			new ButtonBuilder()
				.setCustomId('scissors')
				.setLabel('Nożyce')
				.setEmoji(emojis.scissors)
				.setStyle('Primary'),
		);

	const winner = () => {
		const winner0 = `**Zwycięzca: <@${players[0]}>**`;
		const winner1 = `**Zwycięzca: <@${players[1]}>**`;

		if (choices[players[0]] === choices[players[1]]) {
			return '**Remis.**';
		}
		else if (choices[players[0]] === 'paper') {
			if (choices[players[1]] === 'rock') {
				return winner0;
			}
			else if (choices[players[1]] === 'scissors') {
				return winner1;
			}
		}
		else if (choices[players[0]] === 'rock') {
			if (choices[players[1]] === 'scissors') {
				return winner0;
			}
			else if (choices[players[1]] === 'paper') {
				return winner1;
			}
		}
		else if (choices[players[0]] === 'scissors') {
			if (choices[players[1]] === 'paper') {
				return winner0;
			}
			else if (choices[players[1]] === 'rock') {
				return winner1;
			}
		}
	};

	return await interaction.reply({ content: `<@${players[0]}> rozpoczął grę z <@${players[1]}>. Macie 15 sekund na wybór.`, components: [buttons], allowedMentions: { users: [players[1]] }, fetchReply: true })
		.then(inter => {
			const collector = inter.createMessageComponentCollector({ time: 15000 });
			collector.on('collect', async i => {
				if (!players.includes(i.user.id)) return await i.reply({ content: 'Ale ty przecież nie grasz.', ephemeral: true });
				else if (Object.prototype.hasOwnProperty.call(choices, i.user.id)) return await i.reply({ content: 'Dokonałeś już wyboru.', ephemeral: true });

				choices[i.user.id] = i.customId;
				if (Object.keys(choices).length === 2) {
					collector.stop();
					await i.update({ content: `<@${players[0]}> wybrał(a) ${emojis[choices[players[0]]]}\n<@${players[1]}> wybrał(a) ${emojis[choices[players[1]]]}\n\n${winner()}`, components: [] });
				}
				else {
					collector.resetTimer({ time: 15000 });
					await i.update({ content: `<@${i.user.id}> dokonał wyboru. Czekam na <@${players.filter(player => player !== i.user.id)}>...` });
				}
			});
			collector.on('end', async (_collected, reason) => {
				if (reason === 'time') {
					await interaction.editReply({ content: 'Jeden z graczy nie dokonał wyboru na czas.', components: [buttons] });
				}
			});
		});
};

module.exports = { rock_paper_scissors };