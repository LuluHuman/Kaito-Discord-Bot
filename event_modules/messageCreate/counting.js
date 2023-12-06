const fs = require('fs');
const path = require('path');
const { embed: { titleEmbed } } = require('../../modules/messageHandler')
module.exports = async (client, message) => {
    if (message.channel.id !== "1176793581378351154") return
    // message.channel.send({ embeds: [titleEmbed(client, "colorBG", "success", "I'M TAKING OVER NOW\nNext number: `1`")]});
    const db = client.db.counting
    const curNum = await db.get("curNum")
    const lastUser = await db.get("lastUser")

    const args = message.content.split(" ")
    const cmd = args.shift()

    if (cmd == "?status") {
        message.channel.send(`> Current Number: \`${curNum}\`\n> Last user: <@${lastUser == 0 ? "none" : lastUser}>\n\n> Raw File(client.db // db.json): \`\`\`${JSON.stringify(db)}\`\`\``)
            .catch(err => interaction.client.handleError(message, err))
        return
    }

    if (cmd == "?update") {
        if (!(message.author.id == "635303930879803412")) return message.channel.send(`Bye what you arnt the owner bodo`).catch(err => interaction.client.handleError(message, err))
        args.forEach(val => {
            const i = val.split(":")
            if (!i[0]) return message.channel.send(`Invalid arg0 0`).catch(err => interaction.client.handleError(message, err))
            if (!i[1]) return message.channel.send(`Invalid arg1`).catch(err => interaction.client.handleError(message, err))
            switch (i[0]) {
                case "curNum":
                    db.set("curNum", parseInt(i[1]))
                    break;

                case "lastUser":
                    db.set("lastUser", i[1])
                    break;
                default:
                    message.channel.send(`Invalid arg0 1`).catch(err => interaction.client.handleError(message, err))
                    return
            }

            fs.writeFileSync(path.join(__dirname, '../../db.json'), JSON.stringify(db));
            message.channel.send(`${i[0]} become ${i[1]}`).catch(err => interaction.client.handleError(message, err))
        });
        return
    }

    if (Number.isNaN(parseInt(message.content))) return message.react('🏳️‍🌈').catch(err => interaction.client.handleError(message, err))
    if (message.author.id == lastUser) {
        const newNum = Math.floor(curNum / 50) * 50
        ruinEmed(newNum, "\nYou can't count twice in a row!")
        message.react('❌').catch(err => interaction.client.handleError(message, err))

        await db.set("curNum", newNum)
        await db.set("lastUser", 0)
        return;
    }

    if (parseInt(message.content) == (curNum)) {
        await db.set("curNum", curNum + 1)
        await db.set("lastUser", message.author.id)

        if (curNum % 50 == 0) message.react('✔️');
        message.react('✅').catch(err => interaction.client.handleError(message, err))
    } else {
        const newNum = Math.floor(curNum / 50) * 50
        ruinEmed(newNum)

        await db.set("curNum", newNum)
        await db.set("lastUser", 0)

        message.react('❌').catch(err => interaction.client.handleError(message, err))

    }

    function ruinEmed(newNum, aboutRuin) {
        message.channel.send({
            embeds: [titleEmbed(client, "colorBG", "error",
                `${message.author.tag} RUINED IT AT \`${curNum}\`!! Next number is \`${newNum}\` ` + aboutRuin || ""
            )]
        }).catch(err => interaction.client.handleError(message, err))
    }
}