const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

const rps = async (interaction) => {
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

	return await interaction.reply({ content: `<@${gamers[0]}> rozpoczął grę z <@${gamers[1]}>. Macie 15 sekund na wybór.`, components: [buttons], allowedMentions: { users: [gamers[1]] }, fetchReply: true })
		.then(inter => {
			const collector = inter.createMessageComponentCollector({ time: 15000 });
			collector.on('collect', async i => {
				if (!gamers.includes(i.user.id)) return await i.reply({ content: 'Ale ty przecież nie grasz.', ephemeral: true });
				else if (Object.prototype.hasOwnProperty.call(choices, i.user.id)) return await i.reply({ content: 'Dokonałeś już wyboru.', ephemeral: true });

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
					await interaction.editReply({ content: 'Jeden z graczy nie dokonał wyboru na czas.', components: [] });
				}
			});
		});
};

module.exports = { rps };