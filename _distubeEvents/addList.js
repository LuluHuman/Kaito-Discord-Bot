module.exports = (client, queue, playlist) => {
    const { embed: { playlistinfoEmbed } } = client.modules.messageHandler
    if (client.addingPlaylist && queue.paused) queue.resume(); client.addingPlaylist = false
    queue.textChannel.send({ embeds: [playlistinfoEmbed(playlist, queue, true)] })
}