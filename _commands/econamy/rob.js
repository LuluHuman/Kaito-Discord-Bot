const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const command = {}
command.data = new SlashCommandBuilder().setName('rob').setDescription('Steal dabloons from wallet')
    .addUserOption(option => option.setName('user').setDescription('Who you stelin from').setRequired(true))

command.execute = async (interaction) => {
    const client = interaction.client
    const currencyPrefix = client.config.config_bot.currencyPrefix

    const _userTarget = interaction.options.getUser('user')
    const _userId = interaction.user.id
    const _userBal = await client.db.user.get(_userId, "balance", { wallet: 0, bank: 0 })
    const _targetBal = await client.db.user.get(_userTarget.id, "balance", { wallet: 0, bank: 0 })

    if (_userId == _userTarget.id) return interaction.reply({ embeds: [embed(null, `eh bodoh, so smart ah steal from yourself`)] })
    if (_userTarget.bot) return interaction.reply({ embeds: [embed(null, `go away you can't steal from bots`)] })
    if (_userBal.wallet == 0) return interaction.reply({ embeds: [embed(null, `you need dabloons to rob (to buy a rope etc)`)] })

    const chance = client.random(1, 2)
    if (chance == 2) {
        const chanceWin = client.random(1, _targetBal.wallet)
        interaction.reply({ embeds: [embed(`You stole a small portion 💸!`, `You managed to get ${currencyPrefix + chanceWin}`, `You stole a total of DB$${chanceWin}`)] })
            .catch(err => interaction.client.handleError(interaction, err))

        _userBal.wallet += chanceWin
        await client.db.user.set(_userId, "balance", _userBal)
        _targetBal.wallet -= chanceWin
        await client.db.user.set(_userTarget.id, "balance", _targetBal)
    } else {
        const chanceLose = client.random(1, _userBal.wallet)
        interaction.reply({ embeds: [embed(null, `You were caught **LMAO** :skull:\nYou paid ${_userTarget.username} ${currencyPrefix + chanceLose}`)] })
            .catch(err => interaction.client.handleError(interaction, err))

        _userBal.wallet -= chanceLose
        await client.db.user.set(_userId, "balance", _userBal)
        _targetBal.wallet += chanceLose
        await client.db.user.set(_userTarget.id, "balance", _targetBal)
    }

    function embed(title, description, footer) {
        const embed = new EmbedBuilder().setColor(client.config.color.colorBG)
        if (title) embed.setTitle(title)
        if (description) embed.setDescription(description)
        if (footer) embed.setFooter({ text: footer })
        return embed
    }
}

module.exports = command