const { SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('leave').setDescription('Go out of the Country(voice channel)')
command.execute = async (interaction) => {
    const client = interaction.client
    const { embed: { titleEmbed }, musicControlls } = client.modules.messageHandler
    
    client.distube.voices.leave(interaction)

    const embed = titleEmbed(client, "colorSuccess", "success", "Left voice channel")
    interaction.reply({ embeds: [embed] }).catch(err => interaction.client.handleError(interaction, err))
    
    musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))
}

module.exports = command