const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const currencyPrefix = "<:_ammoutloon:1179609875664359454> "

const command = {}
command.data = new SlashCommandBuilder().setName('highlow').setDescription('Guess if a number is higher or ロウワー. if you win you get money ')
command.cooldown = 40000
command.execute = async (interaction) => {
    const client = interaction.client
    const _userId = interaction.user.id

    const secret = client.random(0, 100)
    const public = client.random(0, 100)

    interaction.reply({
        embeds: [embed(null, `I just chose a secret number between 1 and 100.\nIs the secret number higher or lower than ${public}?`, "The jackpot button is if you think it's the same!")],
        components: [newrow()]
    }).catch(err => interaction.client.handleError(interaction, err))

    const response = await interaction.fetchReply();
    const collector = await response.createMessageComponentCollector({ time: 60000 });

    var responded = false
    collector.on('collect', async i => {
        if (i.user.id !== _userId) return await i.reply({ embeds: [embed(`Go away, this isn't your game`)], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err))
        switch (i.customId) {
            case "highlow.higher":
                if (secret > public) { win() }
                else { loose() }
                break;
            case "highlow.jackpot":
                if (secret == public) { win() }
                else { loose() }
                break;
            case "highlow.lower":
                if (secret < public) { win() }
                else { loose() }
                break;
        }
        responded = true
        i.deferUpdate().catch(err => interaction.client.handleError(interaction, err))
        collector.stop()
    });
    collector.on("end", () => {
        if (!responded) return interaction.editReply({
            embeds: [embed(null, `Too slow\nYour hint was ${public}. The hidden number was ${secret}.`, "This game of high-low expired!", "colorError")],
            components: [row]
        }).catch(err => interaction.client.handleError(interaction, err))
    })

    function embed(title, description, footer, color) {
        const embed = new EmbedBuilder().setColor(client.config.color[color || "colorBG"]).setAuthor({ name: interaction.user.username + "'s high-low game", iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 64 }) })
        if (title) embed.setTitle(title)
        if (description) embed.setDescription(description)
        if (footer) embed.setFooter({ text: footer })
        return embed
    }

    function newrow(disabled) {
        const higher = new ButtonBuilder()
            .setCustomId("highlow.higher")
            .setLabel('higher')
            .setStyle(ButtonStyle.Primary);

        const jackpot = new ButtonBuilder()
            .setCustomId("highlow.jackpot")
            .setLabel('jackpot sad girl')
            .setStyle(ButtonStyle.Primary);

        const lower = new ButtonBuilder()
            .setCustomId("highlow.lower")
            .setLabel('ロウワー')
            .setStyle(ButtonStyle.Primary);
        if (disabled) {
            higher.setDisabled(true)
            jackpot.setDisabled(true)
            lower.setDisabled(true)
        }
        const row = new ActionRowBuilder().addComponents(higher, jackpot, lower);
        return row
    }

    async function win() {
        const money = Math.floor(Math.random() * (100)) + 1
        const bal = await client.db.user.get(_userId, "balance", { wallet: 0, bank: 0 })
        bal.wallet += money
        await client.db.user.set(_userId, "balance", bal)

        const row = newrow(true)
        interaction.editReply({
            embeds: [embed(`You won ${currencyPrefix + money}!`, `Your hint was ${public}. The hidden number was ${secret}.`, "winner winner", "colorSuccess")],
            components: [row]
        }).catch(err => interaction.client.handleError(interaction, err))
    }
    function loose() {
        const row = newrow(true)
        interaction.editReply({
            embeds: [embed(`You lost!`, `Your hint was ${public}. The hidden number was ${secret}.`, "imagine loosing", "colorError")],
            components: [row]
        }).catch(err => interaction.client.handleError(interaction, err))
    }
}

module.exports = command