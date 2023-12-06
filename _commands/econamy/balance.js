const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const command = {}
command.data = new SlashCommandBuilder().setName('balance').setDescription('shows your balance')
    .addUserOption(option => option.setName('user').setDescription('user to show balance of').setRequired(false))

command.execute = async (interaction) => {
    const client = interaction.client
    const currencyPrefix = client.config.config_bot.currencyPrefix

    const user = interaction.options.getUser('user') || interaction.user
    const bal = await client.db.user.get(user.id, "balance", { wallet: 0, bank: 0 })

    const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Balance`)
        .setURL('https://www.youtube.com/watch?v=BbeeuzU5Qc8')
        .setColor(client.config.color.colorBG)
        .addFields(
            { name: "Wallet", value: currencyPrefix + bal.wallet, inline: true },
            { name: "Bank", value: currencyPrefix + bal.bank, inline: true },
            { name: "Total Value", value: currencyPrefix + (bal.wallet + bal.bank), inline: true }
        );
    interaction.reply({ embeds: [embed] }).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command