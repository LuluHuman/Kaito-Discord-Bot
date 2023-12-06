const { SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('volume').setDescription('Change volume of currently playing song')
.addIntegerOption(option => option.setName('volume').setDescription('Volume to set').setRequired(true))

command.execute = async (interaction) => {
  const client = interaction.client
  const { embed: { titleEmbed }, musicControlls, noQueue, musicControllsEmbed } = client.modules.tttModule
  
  const queue = client.distube.getQueue(interaction)
  if (noQueue(interaction)) return;
  
  const volume = interaction.options.getInteger('volume')
  queue.setVolume(volume)

  interaction.reply({ embeds: [titleEmbed(client, "colorBG", "volume", `Volume set to ${volume}%`)], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err))

  const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
  const msg = await MusicPlayerCn.send({ embeds: [titleEmbed(client, "colorBG", "volume", `Volume set to ${volume}%`)] }).catch(err => interaction.client.handleError(interaction, err))
  setTimeout(() => {
    musicControlls(client, musicControllsEmbed(queue.songs[0], queue))
    msg.delete().catch(err => interaction.client.handleError(interaction, err))
  }, 5000);
}

module.exports = command