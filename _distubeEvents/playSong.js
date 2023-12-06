
module.exports = (client, queue, song) => {
    const { musicControlls, musicControllsEmbed, embed: { songinfoEmbed } } = client.modules.messageHandler
    musicControlls(client, musicControllsEmbed(song, queue))
    queue.textChannel.send({ embeds: [songinfoEmbed(song, queue)] })
}