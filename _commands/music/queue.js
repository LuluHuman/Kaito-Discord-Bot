const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { noQueue } = require('../../modules/messageHandler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('See the queue'),
  async execute(interaction) {
    const client = interaction.client
    const queue = client.distube.getQueue(interaction)
    if (noQueue(interaction)) return;
    
    const q = queue.songs
    const exampleEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle('Now Playing: ' + queue.songs[0].name)
      .setURL(queue.songs[0].url)
      .setDescription(`Uploaded by: \`${queue.songs[0].uploader.name}\` \n Requested by: ${queue.songs[0].user}`)
      .addFields({ name: client.config.emojis.queue + "Next up:", value: `\u200B` })
      .setThumbnail(queue.songs[0].thumbnail)

    q.forEach((song, i) => {
      if (i === 0 || i > 23) return
      if (i === 23) return exampleEmbed.addFields({ name: (q.length - 23 )+ " more...", value: `\u200B` })
      exampleEmbed.addFields({ name: i + `. ${song.name}\n${song.url}`, value: `> Uploaded by:\`${song.uploader.name}\` \n > Requested by: ${song.user}` })
    })
    interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(err => require('../../modules/handleError')(interaction, err))
  }
}
