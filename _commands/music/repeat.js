const { SlashCommandBuilder } = require('discord.js')
const command = {}
command.data = new SlashCommandBuilder().setName('repeat').setDescription('Set the repeat mode of the queue')
  .addStringOption(option =>
    option.setName('mode')
      .setDescription('The repeat mode')
      .setRequired(true)
      .addChoices(
        { name: 'Off', value: "0" },
        { name: 'Song', value: "1" },
        { name: 'Queue', value: "2" },
      ))
command.execute = async (interaction) => {
  const client = interaction.client
  const { embed: { titleEmbed }, noQueue, musicControlls, musicControllsEmbed } = client.modules.messageHandler

  const queue = client.distube.getQueue(interaction)
  if (noQueue(interaction)) return;

  var mode = interaction.options.getString('mode')
  mode = queue.setRepeatMode(Number(mode))
  mode = mode ? (mode === 2 ? 'Queue' : 'Song') : 'Off'

  interaction.reply({ embeds: [titleEmbed(client, "colorBG", "repeat", `Set repeat mode to \`${mode}\``)], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err))

  const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
  const msg = await MusicPlayerCn.send({ embeds: [titleEmbed(client, "colorBG", "repeat", `Set repeat mode to \`${mode}\``)] }).catch(err => interaction.client.handleError(interaction, err))
  setTimeout(() => {
    musicControlls(client, musicControllsEmbed(queue.songs[0], queue))
    msg.delete()
  }, 5000);
}

module.exports = command
