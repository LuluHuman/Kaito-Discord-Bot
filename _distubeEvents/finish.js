const { musicControlls, embed: {titleEmbed}} = require('../modules/messageHandler')

module.exports = (client, queue) => {
    musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))
    queue.textChannel.send({ embeds: [titleEmbed(client, "colorBG", "stop", `Stopped - End of queue`)] })
}