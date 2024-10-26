const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { IMGUR_CLIENT_ID } = require('../../config.json'); 
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('imgur')
            .setDescription('Search an image on imgur.')
            .addStringOption( option => 
                option.setName('search')
                    .setDescription('The keyword you want to search')
                    .setRequired(true))
            .addBooleanOption( option => 
                option.setName('nsfw')
                    .setDescription('Whether or not to show NSFW content')
            ),
    
    async execute(interaction) {
        const keyword = interaction.options.getString('search');
        const nsfw = interaction.options.getBoolean('NSFW') ?? false;

        try {
            const imgurResult = await searchImgur(keyword, nsfw);

            if (!imgurResult) {
                await interaction.reply('No images found for that search keyword.');
                return;
            }

            const { title, description, imageLink } = imgurResult;

            const embed = new EmbedBuilder()
                .setColor('#00b0f4')
                .setTitle(title)
                .setURL(imageLink)
                .setDescription(description)
                .setImage(imageLink)
                .setFooter({ text: 'Powered by Imgur' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Error executing the imgur command:', error);
            await interaction.reply('Something went wrong while searching Imgur.');
        }
    }
};

async function searchImgur(query, nsfw) {
    const clientId = IMGUR_CLIENT_ID;
    const url = `https://api.imgur.com/3/gallery/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Client-ID ${clientId}`,
            },
        });

        const results = response.data.data;

        // Filter NSFW content if desired
        const filterResults = nsfw ? results : results.filter(item => !item.nsfw);

        // Choose a random image from the results
        const randomImage = filterResults[Math.floor(Math.random() * filterResults.length)];

        if (!randomImage) return null;

        const title = randomImage?.title || 'No title available';
        const description = randomImage?.description || 'No description available';
        const imageLink = randomImage.is_album ? (randomImage.images && randomImage.images[0] ? randomImage.images[0].link : null) : randomImage.link;

        return {
            title,
            description,
            imageLink
        };
    }
    catch (error) {
        console.error('Error searching Imgur:', error);
        throw new Error('Imgur search failed.');
    }
}
