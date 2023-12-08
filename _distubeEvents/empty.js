module.exports = (client, queue) => {
    const { musicControlls, embed: { titleEmbed } } = client.modules.messageHandler

    musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))
}
