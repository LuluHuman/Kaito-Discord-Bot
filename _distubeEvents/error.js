module.exports = (client, channel, e) => {
    const { embed: { titleEmbed } } = client.modules.messageHandler
    if (channel) channel.send({ embeds: [titleEmbed(client, "colorError", "error", `An error encountered: ${e.toString().slice(0, 1974)}`)] })
}