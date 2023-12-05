const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed, songinfoEmbed }, noQueue } = require('../../modules/messageHandler')
const fs = require('fs')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show the current playing song'),
  async execute(interaction) {
    const client = interaction.client;
    const queue = client.distube.getQueue(interaction)
    if (noQueue(interaction)) return;


    const song = queue.songs[0]
    const embed2 = songinfoEmbed(song, queue)
    interaction.reply({ embeds: [embed2]}).catch(err => require('../../modules/handleError')(interaction, err))
  }
}
