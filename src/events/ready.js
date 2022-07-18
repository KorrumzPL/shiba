const activities = require('../utils/activities.json');
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Zalogowano jako ${client.user.tag}`);
        setInterval(() => {
            let type = Object.keys(activities)[Math.floor(Math.random() * Object.keys(activities).length)]
            client.user.setActivity(
                {
                    name: activities[type][Math.floor(Math.random() * activities[type].length)],
                    type: ActivityType[type]
                });
        }, 30000)
    },
};