const { embed: {songinfoEmbed} } = require('../modules/messageHandler')

module.exports = (client, queue, song) => queue.textChannel.send({ embeds: [songinfoEmbed(song, queue, true)] })