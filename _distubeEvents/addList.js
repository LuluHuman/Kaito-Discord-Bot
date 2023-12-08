module.exports = (client, queue, playlist) => {
    const { embed: { playlistinfoEmbed } } = client.modules.messageHandler
    queue.textChannel.send({ embeds: [playlistinfoEmbed(playlist, queue, true)] })
}