const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed }, noQueue, musicControlls } = require('../../modules/messageHandler')

module.exports = {
  inVoiceChannel: true,
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop Playing'),
  async execute(interaction, isButton) {
    const client = interaction.client;
    const queue = client.distube.getQueue(interaction.guildId)
    if (noQueue(interaction)) return;
    queue.stop().catch(err => require('../../modules/handleError')(interaction, err))
    
    musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))


    if (!isButton) { interaction.reply({ embeds: [titleEmbed(client, "colorBG", "stop", `Stopped`)], ephemeral: true }).catch(err => require('../../modules/handleError')(interaction, err)) }
    else { interaction.deferUpdate().catch(err => require('../../modules/handleError')(interaction, err)) }

    const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
    const msg = await MusicPlayerCn.send({ embeds: [titleEmbed(client, "colorBG", "stop", `Stopped`)] }).catch(err => require('../../modules/handleError')(interaction, err))

    setTimeout(() => {
      msg.delete().catch(err => require('../../modules/handleError')(interaction, err))
    }, 5000);
  }
}
