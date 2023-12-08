const { SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('nowplaying').setDescription('Show the current playing song')
command.execute = async (interaction) => {
  const client = interaction.client;
  const { embed: { songinfoEmbed }, noQueue } = client.modules.messageHandler
  
  const queue = client.distube.getQueue(interaction)
  if (noQueue(interaction)) return;


  const song = queue.songs[0]
  const embed2 = songinfoEmbed(song, queue)
  interaction.reply({ embeds: [embed2] }).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command