const { ActivityType } = require('discord.js');
const { readFile } = require('fs');
const { updateImages } = require('../utils/cache');
const dayjs = require('dayjs');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`${dayjs().format('DD/MM/YYYY HH:MM:ss')} | Zalogowano jako ${client.user.tag}`);

		(function changeActivity() {
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
			setTimeout(changeActivity, 20000, client);
		}());

		updateImages();
	},
};