const fs = require("fs")
const path = require("path")
const { SlashCommandBuilder } = require('discord.js')
const { EmbedBuilder } = require('discord.js');

const command = {}
command.data = new SlashCommandBuilder().setName('xp-leaderboard').setDescription('who\s topping with xp')
command.execute = async (interaction) => {
    const client = interaction.client

    const userDir = path.join(__dirname, `../../userDB`)
    const users = await fs.readdirSync(userDir)
    const totalXP = {}
    var formatted = {}

    const p = users.map(async userID => {
        var xp = await client.db.user.get(userID, "xp", 0)
        if (typeof totalXP[xp] == "object") return totalXP[xp].push(`<@${userID}>`)
        totalXP[xp] = [`<@${userID}>`]
    });
    await Promise.all(p)

    var description = "Here's a list of discord kittens"
    const help = new EmbedBuilder()
        .setTitle('Leaderboard')
        .setColor('#FFFF00')

    const xps = Object.keys(totalXP).toSorted((a, b) => a - b);
    xps.reverse()
    place = 0
    xps.forEach(xp => {
        var prefix = ""
        place++
        if (place == 1) prefix = "🥇"
        if (place == 2) prefix = "🥈"

        formatted[xp] = totalXP[xp]
        description += `\n${prefix}${xp} xp - ${totalXP[xp].join(",")}`
    });
    help.setDescription(description)

    await interaction.reply({
        embeds: [help],
    });
}

module.exports = command