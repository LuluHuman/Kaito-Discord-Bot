const { SlashCommandBuilder } = require('discord.js')
module.exports = {
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName('memes')
        .setDescription('Get a random meme from r/memes'),
    async execute(interaction) {
        await interaction.deferReply()
        const client = interaction.client;
        const embed = await require('../../modules/reddit').memeEmbed(client, "memes", interaction)

        interaction.editReply({ embeds: [embed] }).catch(err => require('../../modules/handleError')(interaction, err))
    }
}