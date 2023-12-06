module.exports = (client, queue, song) => {
    const { embed: { songinfoEmbed } } = client.modules.messageHandler
    queue.textChannel.send({ embeds: [songinfoEmbed(song, queue, true)] })
}
