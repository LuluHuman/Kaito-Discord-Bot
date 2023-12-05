const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed }, noQueue, musicControlls, musicControllsEmbed } = require('../../modules/messageHandler')

module.exports = {
  inVoiceChannel: true,
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Set the repeat mode of the queue')
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('The repeat mode')
        .setRequired(true)
        .addChoices(
          { name: 'Off', value: "0" },
          { name: 'Song', value: "1" },
          { name: 'Queue', value: "2" },
        )),
  async execute(interaction) {
    const client = interaction.client
    const queue = client.distube.getQueue(interaction)
    if (noQueue(interaction)) return;

    var mode = interaction.options.getString('mode')
    mode = queue.setRepeatMode(Number(mode))
    mode = mode ? (mode === 2 ? 'Queue' : 'Song') : 'Off'

    interaction.reply({ embeds: [titleEmbed(client, "colorBG", "repeat", `Set repeat mode to \`${mode}\``)], ephemeral: true }).catch(err => require('../../modules/handleError')(interaction, err))

    const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
    const msg = await MusicPlayerCn.send({ embeds: [titleEmbed(client, "colorBG", "repeat", `Set repeat mode to \`${mode}\``)] }).catch(err => require('../../modules/handleError')(interaction, err))
    setTimeout(() => {
      musicControlls(client, musicControllsEmbed(queue.songs[0], queue))
      msg.delete()
    }, 5000);
  }
}
