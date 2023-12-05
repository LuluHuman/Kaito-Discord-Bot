const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed }, musicControlls } = require('../../modules/messageHandler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Go out of the Country(voice channel)'),
  async execute(interaction) {
    const client = interaction.client
    client.distube.voices.leave(interaction)

    const embed = titleEmbed(client, "colorSuccess", "success", "Left voice channel")
    interaction.reply({ embeds: [embed] }).catch(err => require('../../modules/handleError')(interaction, err))
    musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))
  }
}
