module.exports = (client, channel) => {
    const { musicControlls, embed: { titleEmbed } } = client.modules.messageHandler
    musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))
    channel.send({ embeds: [titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`)] })
}
