const { musicControlls, embed: { titleEmbed } } = require('../modules/messageHandler')

module.exports = (client, channel) => {
    musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))
    channel.send({ embeds: [titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`)] })
}