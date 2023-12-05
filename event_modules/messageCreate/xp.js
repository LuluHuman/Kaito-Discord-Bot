module.exports = async (client, message) => {
    var xp = await client.db.user.get(message.author.id, "xp", 0)
    var levelBefore = Math.floor(xp / 1000)
    if (client.xpTimer.get(message.author.id) == false) return

    xp = xp + RandomNumber(15, 25)

    await client.db.user.set(message.author.id, "xp", xp)

    const level = Math.floor(xp / 1000)
    if (levelBefore < level) {message.channel.send({ content: `Congratulations ${message.author}! You have reached level ${level}!` })}
    client.xpTimer.set(message.author.id, false)
    setTimeout(function () {client.xpTimer.set(message.author.id, true)}, 60000)
    function RandomNumber() { return Math.floor(Math.random() * (39)) + 15 }
}