const { ActivityType } = require('discord.js');
const { readFile } = require('fs');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Zalogowano jako ${client.user.tag}`);
		setInterval(() => {
			readFile('src/utils/activities.json', (error, data) => {
				if (error) throw error;
				const activities = JSON.parse(data);
				const type = Object.keys(activities)[Math.floor(Math.random() * Object.keys(activities).length)];
				client.user.setActivity(
					{
						name: activities[type][Math.floor(Math.random() * activities[type].length)],
						type: ActivityType[type],
					});
			});
		}, 20000);
	},
};