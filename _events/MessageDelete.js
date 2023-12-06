const { Events } = require('discord.js');
const { embed: { titleEmbed } } = require('../modules/messageHandler')
const event = {}
event.name = Events.MessageDelete

event.execute = async (message) => {
    if (!message.author) return
    if (message.author.bot) return;
    const client = message.client;

    if (!(message.channel.id == "1176793581378351154")) return
    const curNum = client.db.counting.get("curNum")

    const lastNum = parseInt(message.content);
    if (lastNum == curNum - 1) {
        message.channel.send({
            embeds: [titleEmbed(client, "colorBG", "error", `${message.author.tag} deleted the message for \`${lastNum}\`\n Next number is \`${curNum}\`.`
            )]
        }).catch(err => message.client.handleError({ commandName: __filename }, err))
    }
}

module.exports = event