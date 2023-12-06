const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed }, noQueue } = require('../../modules/messageHandler')

const command = {}
command.data = new SlashCommandBuilder().setName('skip').setDescription('Skip the current song')
command.execute = async (interaction, isButton) => {
  const client = interaction.client
  if (noQueue(interaction)) return;

  const queue = client.distube.getQueue(interaction)
  if (!queue.songs[1]) return interaction.reply({ embeds: [titleEmbed(client, "colorError", "error", "no song after this")], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err))
  if (queue.paused) queue.resume().catch(err => interaction.client.handleError(interaction, err))
  queue.skip().catch(err => interaction.client.handleError(interaction, err))
  try {
    if (!isButton) { interaction.reply({ embeds: [titleEmbed(client, "colorBG", "success", "Current song was skipped")], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err)) }
    else { interaction.deferUpdate().catch(err => interaction.client.handleError(interaction, err)) }

    const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
    const msg = await MusicPlayerCn.send({ embeds: [titleEmbed(client, "colorBG", "success", "Current song was skipped")] }).catch(err => interaction.client.handleError(interaction, err))

    setTimeout(() => {
      msg.delete().catch(err => interaction.client.handleError(interaction, err))
    }, 5000);
  } catch (e) {
    interaction.client.handleError(interaction, e)
  }
}

module.exports = command