const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Return the current ping of the server.'),
    
    async execute(interaction) {
        const latency = Date.now() - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);
        await interaction.reply(`Latency: ${latency}ms\nAPI Latency: ${apiLatency}ms`);
    },
};