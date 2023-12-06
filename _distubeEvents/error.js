const { musicControlls, embed: { titleEmbed } } = require('../modules/messageHandler')

module.exports = (client, channel, e) => {
    if (channel) channel.send({ embeds: [titleEmbed(client, "colorError", "error", `An error encountered: ${e.toString().slice(0, 1974)}`)] })
}