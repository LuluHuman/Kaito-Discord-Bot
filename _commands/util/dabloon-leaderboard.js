const fs = require("fs")
const path = require("path")
const { SlashCommandBuilder } = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const currencyPrefix = "<:_ammoutloon:1179609875664359454> "


module.exports = {
    data: new SlashCommandBuilder()
        .setName('dabloon-leaderboard')
        .setDescription('who\s topping with dabloons'),
    async execute(interaction) {
        const client = interaction.client

        const userDir = path.join(__dirname, `../../userDB`)
        const users = await fs.readdirSync(userDir)
        const totalXP = {}
        var formatted = {}

        const p = users.map(async userID => {
            const dabloons = await client.db.user.get(userID, "balance", { wallet: 0, bank: 0 })
            const value = dabloons.wallet + dabloons.bank
            if (typeof totalXP[value] == "object") return totalXP[value].push(`<@${userID}>`)
            totalXP[value] = [`<@${userID}>`]
        });
        await Promise.all(p)

        var description = "Here's a list of rich people"
        const help = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setColor('#FFFF00')

        const xps = Object.keys(totalXP).toSorted((a, b) => a - b);
        xps.reverse()
        var place = 0
        xps.forEach(dabloons => {
            var prefix = ""
            place++
            if (place == 1) prefix = "🥇"
            if (place == 2) prefix = "🥈"
            formatted[dabloons] = totalXP[dabloons]
            description += `\n${prefix}${currencyPrefix}${dabloons} - ${totalXP[dabloons].join(",") }`
        });
        help.setDescription(description)

        await interaction.reply({
            embeds: [help],
        });
    }
}
