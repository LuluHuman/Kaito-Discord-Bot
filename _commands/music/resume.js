const { SlashCommandBuilder } = require('discord.js')
const { embed: { queueSnippet }, noQueue, musicControlls, musicControllsEmbed } = require('../../modules/messageHandler')

const command = {}
command.data = new SlashCommandBuilder().setName('resume').setDescription('Resume the current song')
command.execute = async (interaction) => {
  const client = interaction.client
  const queue = client.distube.getQueue(interaction)

  if (noQueue(interaction)) return;

  const embed2 = queueSnippet(queue, !queue.paused)
  queue.resume()

  const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
  const msg = await MusicPlayerCn.send({ embeds: [embed2] }).catch(err => interaction.client.handleError(interaction, err))

  setTimeout(() => {
    musicControlls(client, musicControllsEmbed(queue.songs[0], queue))
    msg.delete().catch(err => interaction.client.handleError(interaction, err))
  }, 5000);
}

module.exports = command