const { REST, Routes } = require('discord.js');
const { clientId, guildId, DISCORD_TOKEN } = require('./config.json');

const rest = new REST().setToken(DISCORD_TOKEN);

// for guild commands
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);
