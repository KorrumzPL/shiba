require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Routes, REST } = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

if (process.env.BOT_ENV === 'development') {
	rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
		.then(() => console.log('Pomyślnie zarejestrowano komendy.'))
		.catch(console.error);
}
else if (process.env.BOT_ENV === 'production') {
	rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
		.then(() => console.log('Pomyślnie zarejestrowano komendy.'))
		.catch(console.error);
}