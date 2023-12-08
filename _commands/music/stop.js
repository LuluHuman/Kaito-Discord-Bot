const { SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('stop').setDescription('Stop Playing')
command.execute = async (interaction, isButton) => {
  const client = interaction.client;
  const { embed: { titleEmbed }, noQueue, musicControlls } = client.modules.messageHandler

  const queue = client.distube.getQueue(interaction.guildId)
  if (noQueue(interaction)) return;
  queue.stop().catch(err => interaction.client.handleError(interaction, err))

  musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))

  if (!isButton) { interaction.reply({ embeds: [titleEmbed(client, "colorBG", "stop", `Stopped`)], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err)) }
  else { interaction.deferUpdate().catch(err => interaction.client.handleError(interaction, err)) }

  const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
  const msg = await MusicPlayerCn.send({ embeds: [titleEmbed(client, "colorBG", "stop", `Stopped`)] }).catch(err => interaction.client.handleError(interaction, err))

  setTimeout(() => {
    msg.delete().catch(err => interaction.client.handleError(interaction, err))
  }, 5000);
}

module.exports = command