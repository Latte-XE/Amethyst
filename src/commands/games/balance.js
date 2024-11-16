const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const currency = require('../../helpers/currencyHelper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check the balance of a user.')
        .addUserOption(option =>
            option.setName('user').setDescription('The user to check.')
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('user') ?? interaction.user;
        const balance = currency.getBalance(target.id);
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${target.username} has $${balance}`,
                iconURL: target.displayAvatarURL()
            })
            .setColor('#7f00ff')
            .setFooter({
                text: 'Amethyst • a functional discord bot',
                iconURL: 'https://i.imgur.com/7H8rGZs.png',
        });

        await interaction.reply({ embeds: [embed] });
    },
};
