const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Return the current ping of the server.'),
    
    async execute(interaction) {
        await interaction.reply(`Ping: ${interaction.guild.ping} ms`);
    },
};