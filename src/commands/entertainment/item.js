const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users, CurrencyShop } = require('../../dbObjects');
const { Op } = require('sequelize');
const currencyHelper = require('../../helpers/currencyHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('item')
		.setDescription('Commands related to items.')
		.addSubcommand(subcommand =>
			subcommand
                .setName('buy')
                .setDescription('Buy an item from the shop')
                .addStringOption(option => 
                    option.setName('item')
                        .setDescription('Items to buy')
                        .setAutocomplete(true))
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('The amount of item to buy')
                ),
		)
		.addSubcommand(subcommand =>
			subcommand
                .setName('shop')
                .setDescription('Display shop'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('pipi')
				.setDescription('Check the balance of a user.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('The user to check.')
				),
		),

    async autocomplete(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'buy') {
            const focusedValue = interaction.options.getFocused();

            const shopItems = await CurrencyShop.findAll({ attributes: ['name'] });
            const filtered = shopItems
                .map(item => item.name)
                .filter(item => item.toLowerCase().startsWith(focusedValue.toLowerCase()));

            await interaction.respond(
                filtered.slice(0, 25).map(item => ({ name: item, value: item }))
            );
        }

    },

	async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'buy') {
            const itemName = interaction.options.getString('item');
            const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
            const quantity = interaction.options.getInteger('amount');
            const item_cost = item.cost * quantity;
        
            if (!item) return interaction.reply(`That item doesn't exist.`);
            if (item_cost > currencyHelper.getBalance(interaction.user.id)) {
                return interaction.reply({ content: `You currently have ${currencyHelper.getBalance(interaction.user.id)}, but ${item.name} * ${quantity} costs ${item_cost}!`, ephemeral: true });
            }
        
            const user = await Users.findOne({ where: { user_id: interaction.user.id } });
            currencyHelper.addBalance(interaction.user.id, -item_cost);
            for (let i = 0; i <= quantity; i++) await user.addItem(item);
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setDescription('')
                .setColor('#7f00ff')
                .setFooter({
                    text: 'Amethyst • a functional discord bot',
                    iconURL: 'https://i.imgur.com/7H8rGZs.png',
                });
            return interaction.reply({ embeds: [embed] });
        }
        else if (subcommand === 'shop') {
            const items = await CurrencyShop.findAll();
            return interaction.reply(codeBlock(items.map(i => `${i.name}: ${i.cost}💰`).join('\n')));
        }
	},
};