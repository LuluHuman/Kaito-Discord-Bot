const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('queue').setDescription('See the queue')
command.execute = async (interaction) => {
  const client = interaction.client
  const { noQueue } = client.modules.messageHandler

  const queue = client.distube.getQueue(interaction)
  if (noQueue(interaction)) return;

  const q = queue.songs
  const exampleEmbed = new EmbedBuilder()
    .setColor("#ff0000")
    .setTitle('Now Playing: ' + queue.songs[0].name)
    .setURL(queue.songs[0].url)
    .setDescription(`\`${queue.songs[0].uploader.name}\` | Req: ${queue.songs[0].user}`)
    .addFields({ name: client.config.emojis.queue + "Next up:", value: `\u200B` })

  q.forEach((song, i) => {
    if (i === 0 || i > 7) return
    if (i === 7) return exampleEmbed.addFields({ name: (q.length - 4) + " more...", value: `\u200B` })
    exampleEmbed.addFields({ name: i + `. ${song.name}`, value: `* \`${song.uploader.name}\` | Req: ${song.user}\n* [Open in Youtue](${song.url})` })
  })
  interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command