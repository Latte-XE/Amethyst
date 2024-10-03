const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
            .setName('rps')
            .setDescription('A game of "Rock, Paper, Scissor".'),
    
	async execute(interaction) {
		const selections = new StringSelectMenuBuilder()
			.setCustomId('rps')
			.setPlaceholder('Make a selection!')
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

		const response = await interaction.reply({
			content: 'Rock, Paper, Scissor!',
			components: [row],
		});

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
        const options = ['rock', 'paper', 'scissor'];
        const botChoice = options[Math.round(Math.random() * 3)];

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

            selections.setDisabled(true);

            await input.reply({ content: `Your choice: ${value}\nBot choice: ${botChoice}\n${result}`});
            await interaction.editReply({ components: [row] });
        });
	},
};