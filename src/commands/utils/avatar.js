const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Provides user avatar.')
        .addUserOption( option =>
            option.setName('user')
                .setDescription('The user you want to display.')
                .setRequired(true)),  
    
	async execute(interaction) {
		const target = interaction.options.getUser('user');

        const embed = new EmbedBuilder()
            .setTitle(`${target.tag}'s avatar`)
            .setImage(target.displayAvatarURL({ size: 2048 }))
            .setColor('#7f00ff')
            .setFooter({
                text: 'Amethyst • a functional discord bot',
                iconURL: 'https://i.imgur.com/7H8rGZs.png',
        });
      
      await interaction.reply({ embeds: [embed] });

	},
};