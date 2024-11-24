const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addBalance } = require('../../helpers/currencyHelper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addbalance')
        .setDescription('Add balance to a user.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('The user to check.')
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('The amount of balance to add.')
            .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const balanceAmount = interaction.options.getInteger('amount')

        addBalance(target.id, balanceAmount);

        const embed = new EmbedBuilder()
            .setTitle(`Added $${balanceAmount} to ${target.username}`)
            .setColor('#7f00ff')
            .setFooter({
                text: 'Amethyst • a functional discord bot',
                iconURL: 'https://i.imgur.com/7H8rGZs.png',
        });

        await interaction.reply({ embeds: [embed] });
    },
};