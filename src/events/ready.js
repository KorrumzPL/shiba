const { ActivityType } = require('discord.js');
const { prisma } = require('../utils/functions/client');
const { updateImages } = require('../utils/functions/animals');
const dayjs = require('dayjs');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`${dayjs().format('DD/MM/YYYY HH:MM:ss')} | Zalogowano jako ${client.user.tag}`);

		(async function changeActivity() {
			const activities = await prisma.activity.findMany();
			const random = activities[Math.floor(Math.random() * activities.length)];
			client.user.setActivity(
				{
					name: random.name,
					type: ActivityType[random.type],
				});
			setTimeout(changeActivity, 20000, client);
		}()).catch(console.error);

		updateImages();
	},
};