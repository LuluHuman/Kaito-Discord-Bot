const { SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('memes').setDescription('Get a random meme from r/memes')
command.execute = async (interaction) => {
        await interaction.deferReply()
        const client = interaction.client;
        const embed = await client.modules.reddit.memeEmbed(client, "memes", interaction)

        interaction.editReply({ embeds: [embed] }).catch(err => interaction.client.handleError(interaction, err))
}
module.exports = command