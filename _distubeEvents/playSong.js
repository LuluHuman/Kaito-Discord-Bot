const { musicControlls, musicControllsEmbed, embed: {songinfoEmbed} } = require('../modules/messageHandler')

module.exports = (client, queue, song) => {
    musicControlls(client, musicControllsEmbed(song, queue))
    queue.textChannel.send({
        embeds: [songinfoEmbed(song, queue)]
    })
}