const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed }, noQueue } = require('../../modules/messageHandler')

module.exports = {
  inVoiceChannel: true,
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),
  async execute(interaction, isButton) {
    const client = interaction.client
    if (noQueue(interaction)) return;

    const queue = client.distube.getQueue(interaction)
    if (!queue.songs[1]) return interaction.reply({ embeds: [titleEmbed(client, "colorError", "error", "no song after this")], ephemeral: true }).catch(err => require('../../modules/handleError')(interaction, err))
    if (queue.paused) queue.resume().catch(err => require('../../modules/handleError')(interaction, err))
    queue.skip().catch(err => require('../../modules/handleError')(interaction, err))
    try {
      if (!isButton) { interaction.reply({ embeds: [titleEmbed(client, "colorBG", "success", "Current song was skipped")], ephemeral: true }).catch(err => require('../../modules/handleError')(interaction, err)) }
      else { interaction.deferUpdate().catch(err => require('../../modules/handleError')(interaction, err)) }

      const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
      const msg = await MusicPlayerCn.send({ embeds: [titleEmbed(client, "colorBG", "success", "Current song was skipped")] }).catch(err => require('../../modules/handleError')(interaction, err))

      setTimeout(() => {
        msg.delete().catch(err => require('../../modules/handleError')(interaction, err))
      }, 5000);
    } catch (e) {
      require('../../modules/handleError')(interaction, e)
    }
  }
}
