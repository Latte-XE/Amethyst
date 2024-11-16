const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const { DISCORD_TOKEN, clientId, guildId } = require('./config.json');
const { commandHandler, eventHandler } = require('./helpers/handlers');
const currencyHelpers = require('./helpers/currencyHelper');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: Object.values(GatewayIntentBits) });
client.commands = new Collection();

// Load currency data
currencyHelpers.loadBalances();

// Deploy commands
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(folderPath, file));
        if ('data' in command) {
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

// Load commands and events
commandHandler(client);
eventHandler(client);

client.login(DISCORD_TOKEN);
