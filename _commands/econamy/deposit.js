const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const command = {}
command.data = new SlashCommandBuilder().setName('deposit').setDescription('deposit dabloons out of your wallet to bank')
    .addStringOption(option => option.setName('amount').setDescription('A constant like 1000 OR keyword like all').setRequired(true))

command.execute = async (interaction) => {
    const client = interaction.client
    const currencyPrefix = client.config.config_bot.currencyPrefix

    const _ammout = interaction.options.getString('amount')
    const _userId = interaction.user.id
    const _userBal = await client.db.user.get(_userId, "balance", { wallet: 0, bank: 0 })

    const _balanceToInt = parseInt(_ammout)
    var depositedBal = 0

    if (_balanceToInt) {
        depositedBal = _balanceToInt
        _userBal.wallet -= _balanceToInt
        _userBal.bank += _balanceToInt
    }
    if (_ammout.toLowerCase() == "all") {
        depositedBal = _userBal.wallet
        _userBal.bank += _userBal.wallet
        _userBal.wallet = 0
    }
    if (depositedBal == 0) {
        interaction.reply({ content: `Invalid amount (${_ammout}) lah bodo` }).catch(err => interaction.client.handleError(interaction, err))
        return
    }
    await client.db.user.set(_userId, "balance", _userBal)

    const embed = new EmbedBuilder()
        .setTitle(`Deposited DB$${depositedBal}`)
        .setURL('https://www.youtube.com/watch?v=BbeeuzU5Qc8')
        .setColor(client.config.color.colorBG)
        .addFields(
            { name: "Wallet", value: currencyPrefix + _userBal.wallet, inline: true },
            { name: "Bank", value: currencyPrefix + _userBal.bank, inline: true },
            { name: "Total Value", value: currencyPrefix + (_userBal.wallet + _userBal.bank), inline: true }
        );
    interaction.reply({ embeds: [embed] }).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command