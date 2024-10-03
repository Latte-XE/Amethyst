const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ComponentType, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
            .setName('rps')
            .setDescription('A game of "Rock, Paper, Scissor".'),
    
	async execute(interaction) {
		const selections = new StringSelectMenuBuilder()
			.setCustomId('rps')
			.setPlaceholder('Rock, Paper or Scissor')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Rock')
					.setValue('rock'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Paper')
					.setValue('paper'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Scissor')
					.setValue('scissor'),
			);

		const row = new ActionRowBuilder()
			.addComponents(selections);

        const embed1 = new EmbedBuilder()
            .setTitle(':video_game: | Rock Paper Scissor')
            .setDescription('Choose an option below.')
            .setColor('#00b0f4')
            .setFooter({
                text: 'Amethyst • a functional discord bot',
                iconURL: 'https://i.imgur.com/7H8rGZs.png',
        });

		const response = await interaction.reply({
            embeds: [embed1],
			components: [row],
		});

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
        const options = ['rock', 'paper', 'scissor'];
        const botChoice = options[Math.round(Math.random() * 2)];

        collector.on('collect', async input => {
            const value = input.values[0];
            let result = '';

            if (value === botChoice) {
                result = 'It\'s a tie!';
            }
            else if (value === 'rock' && botChoice === 'paper' || 
                    value === 'paper' && botChoice === 'scissor' || 
                    value === 'scissor' && botChoice === 'rock'
            ) {
                result = 'You Lose!'
            }
            else {
                result = 'You Win!'
            }

            const embed2 = new EmbedBuilder()
                .setTitle(':video_game: | Rock Paper Scissor')
                .setDescription(`Your choice: ${value}\nBot choice: ${botChoice}\n\n**${result}**`)
                .setColor('#00b0f4')
                .setFooter({
                    text: 'Amethyst • a functional discord bot',
                    iconURL: 'https://i.imgur.com/7H8rGZs.png',
            });

            selections.setDisabled(true);

            await input.reply({ embeds: [embed2] });
            await interaction.editReply({ components: [row] });
        });
	},
};