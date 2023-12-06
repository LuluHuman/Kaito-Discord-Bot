const { embed: { playlistinfoEmbed } } = require('../modules/messageHandler')

module.exports = (client, queue, playlist) => {
    if (client.addingPlaylist && queue.paused) queue.resume(); client.addingPlaylist = false
    queue.textChannel.send({ embeds: [playlistinfoEmbed(playlist, queue, true)] })
}