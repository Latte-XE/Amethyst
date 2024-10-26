const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rurou')
        .setDescription('A game of Russian roulette')
        .addIntegerOption(option =>
            option
                .setName('mode')
                .setDescription('The mode you desire.')
                .setChoices(
                    { name: 'Single Spin', value: 1 },
                    { name: 'Re-spin', value: 2 },
                )
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('bullet')
                .setDescription('The number of bullets loaded')
                .setChoices(
                    { name: '1 Bullet', value: 1 },
                    { name: '2 Bullets', value: 2 },
                    { name: '3 Bullets', value: 3 },
                    { name: '4 Bullets', value: 4 },
                    { name: '5 Bullets', value: 5 }
                )
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option
                .setName('bet')
                .setDescription('The bet you place')
                .setRequired(false) // TODO: change this when database is ready
        ),


    async execute(interaction) {
        const bet = interaction.options.getInteger('bet') ?? 0; // Use when database is ready
        const bulletCount = interaction.options.getInteger('bullet') ?? 1; // default : 1 bullet
        const gameMode = interaction.options.getInteger('mode');
        const gun = load(bulletCount);

        const embed = new EmbedBuilder()
            .setTitle('New russian roulette game started')
            .setDescription(`:white_check_mark: You've place a bet of $${bet}.`)
            .setColor('#7f00ff')
            .setFooter({
                text: 'Amethyst • a functional discord bot',
                iconURL: 'https://i.imgur.com/7H8rGZs.png',
        });
      
        await interaction.reply({ embeds: [embed] });

        if (gameMode === 1) {
            singleSpin(interaction, bet, gun)
        }
        else if (gameMode === 2) {
            reSpin(interaction, bet, gun);
        }
    }
}

function load(cnt) {
    let container = Array(6).fill(0);

    for (let i = 0; i < cnt; i++) {
        let rnum = Math.floor(Math.random() * 6);

        while (container[rnum] !== 0) {
            rnum = Math.floor(Math.random() * 6);
        }
        
        container[rnum] = 1;
    }

    return container;
}

async function singleSpin(interaction, money, container) {
    const userID = interaction.user.id;

    for (let i = 0; i < container.length; i++) {
        if (i % 2 === 0) { // Player's turn
            if (container[i] === 1) {
                await interaction.channel.send(`<@${userID}> shoot yourself at round ${i + 1}`);
                await wait(500);
                await interaction.followUp(`Game over, <@${userID}> lose ${money} dollars.`);
                return;
            }
            else {
                await interaction.channel.send(`<@${userID}> survived round ${i + 1}`);
            }
        } 
        else { // Bot's turn
            if (container[i] === 1) {
                await interaction.channel.send(`The bot shoot itself at round ${i + 1}`);
                await wait(500);
                await interaction.followUp(`Game over, <@${userID}> win ${money} dollars.`);
                return;
            }
            else {
                await interaction.channel.send(`The bot survived round ${i + 1}`);
            }
        }

        await wait(500);
    }
}

async function reSpin(interaction, money, container) {
    const userID = interaction.user.id;
    let turn = 0

    while (true) {
        const rnum = Math.floor(Math.random() * 6);

        if (turn % 2 === 0) { // Player's turn
            if (container[rnum] === 1) {
                await interaction.channel.send(`<@${userID}> shoot yourself at round ${turn + 1}`);
                await wait(500);
                await interaction.followUp(`Game over, <@${userID}> lose ${money} dollars.`);
                return;
            }
            else {
                await interaction.channel.send(`<@${userID}> survived round ${turn + 1}`);
                turn++;
            }
        } 
        else { // Bot's turn
            if (container[rnum] === 1) {
                await interaction.channel.send(`The bot shoot itself at round ${turn + 1}`);
                await wait(500);
                await interaction.followUp(`Game over, <@${userID}> win ${money} dollars.`);
                return;
            }
            else {
                await interaction.channel.send(`The bot survived round ${turn + 1}`);
                turn++;
            }
        }

        await wait(500);
    }
}