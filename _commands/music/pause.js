const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed, queueSnippet }, noQueue, musicControlls, musicControllsEmbed } = require('../../modules/messageHandler')

module.exports = {
  inVoiceChannel: true,
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current song'),
  async execute(interaction, isButton) {
    const client = interaction.client
    const queue = client.distube.getQueue(interaction)
    
    if (noQueue(interaction)) return;

    const embed2 = queueSnippet(queue, !queue.paused)
    if (queue.paused) {queue.resume()}
    else {queue.pause()}



    if (!isButton) {
      interaction.reply({ embeds: [embed2], ephemeral: true })
        .catch(err => require('../../modules/handleError')(interaction, err))
    } else {
      interaction.deferUpdate()
    }

    const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
    const msg = await MusicPlayerCn.send({ embeds: [embed2] }).catch(err => require('../../modules/handleError')(interaction, err))

    setTimeout(() => {
      musicControlls(client, musicControllsEmbed(queue.songs[0], queue))
      msg.delete().catch(err => require('../../modules/handleError')(interaction, err))
    }, 5000);
  }
}
