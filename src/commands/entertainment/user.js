const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const currency = require('../../helpers/currencyHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Info about a user')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('The user to show'))
		)
		.addSubcommand(subcommand =>
			subcommand
			.setName('avatar')
			.setDescription('Provides user avatar.')
			.addUserOption( option =>
				option.setName('user')
					.setDescription('The user\'s avatar to display.')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('balance')
				.setDescription('Check the balance of a user.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('The user to check.')
				),
		),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'info') {
			const target = interaction.options.getUser('user') ?? interaction.user;
			const member = await interaction.guild.members.fetch(target.id);

			const embed = new EmbedBuilder()
				.setAuthor({
					name: target.username,
					iconURL: target.displayAvatarURL(),
				})
				.addFields({
						name: 'Joined at:',
						value: `${member.joinedAt}`,
						inline: false
				})
				.setColor('#7f00ff')
				.setFooter({
					text: 'Amethyst • a functional discord bot',
					iconURL: 'https://i.imgur.com/7H8rGZs.png',
				});
			await interaction.reply({ embeds: [embed] });
		}
		else if (subcommand === 'avatar') {
			const target = interaction.options.getUser('user') ?? interaction.user;

			const embed = new EmbedBuilder()
				.setTitle(`${target.username}'s avatar`)
				.setURL(target.displayAvatarURL({ size: 2048 }))
				.setImage(target.displayAvatarURL({ size: 2048 }))
				.setColor('#7f00ff')
				.setFooter({
					text: 'Amethyst • a functional discord bot',
					iconURL: 'https://i.imgur.com/7H8rGZs.png',
				});
			await interaction.reply({ embeds: [embed] });
		}
		else if (subcommand === 'balance') {
			const target = interaction.options.getUser('user') ?? interaction.user;
			const balance = currency.getBalance(target.id);
			const bank_balance = currency.getBalance(target.id, 'bank_balance')

			const embed = new EmbedBuilder()
				.setAuthor({
					name: `${target.username}`,
					iconURL: target.displayAvatarURL()
				})
				.addFields({
					name: 'Cash:',
					value: `$${balance}`,
					inline: true
				},
				{
					name: 'Bank:',
					value: `$${bank_balance}`,
					inline: true
				})
				.setColor('#7f00ff')
				.setFooter({
					text: 'Amethyst • a functional discord bot',
					iconURL: 'https://i.imgur.com/7H8rGZs.png',
				});
			await interaction.reply({ embeds: [embed] });
		}
	},
};