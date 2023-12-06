const fs = require('fs');
const { embed: { titleEmbed }, musicControlls } = require('../modules/messageHandler')
const { Events, ActivityType } = require('discord.js');
const event = {}
event.name = Events.ClientReady
event.once = true

event.execute = async (client) => {
    console.clear()
    console.log(`[INFO] Logged in as ${client.user.tag}!`);

    // Send logs
    const errorLogs = fs.readFileSync("/home/lulu/.pm2/logs/KaitoBot-error.log", "utf-8")
    const errors = errorLogs.split("\n").filter(ln => !(ln.includes("DeprecationWarning") || ln.includes("node --trace-deprecation")))
    const iErrors = errors.filter(ln => !ln.startsWith("    at"))
    if (iErrors.length >= 1 && iErrors[0] !== "") {
        const general = client.channels.cache.get('1144621437215322194')
        general.send(`Bot restarted due to  \`${iErrors.length}\` errors\n\`\`\`js\n${errors.join("\n")}\`\`\``)
    }
    // Clear logs
    fs.writeFileSync("/home/lulu/.pm2/logs/KaitoBot-error.log", "")
    fs.writeFileSync("/home/lulu/.pm2/logs/KaitoBot-out.log", "")

    // Set status
    client.user.setPresence({
        activities: [{ name: `神のまにまに`, type: ActivityType.Listening }],
        status: 'dnd',
    });

    // Cache counting
    const couting = client.channels.cache.get('1176793581378351154')
    couting.messages

    // Reset player
    musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))
}

module.exports = event