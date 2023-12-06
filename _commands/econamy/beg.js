const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const command = {}
command.data = new SlashCommandBuilder().setName('beg').setDescription('beg someone for something')
command.cooldown = 10000

command.execute = async (interaction) => {
    const client = interaction.client
    const begResponses = client.config.begResponses
    const names = client.config.names
    const currencyPrefix = client.config.config_bot.currencyPrefix

    const user = interaction.options.getUser('user') || interaction.user
    const bal = await client.db.user.get(user.id, "balance", { wallet: 0, bank: 0 })

    const _chance = Math.floor(Math.random() * (2)) + 1
    const _type = _chance == 2 ? "money" : "nothing"
    const _i = Object.keys(begResponses[_type]).length
    const _randomI = Math.floor(Math.random() * (_i))
    const response = begResponses[_type][_randomI]

    const _iname = Object.keys(names.Names).length
    const _randomInames = Math.floor(Math.random() * (_iname))
    const name = names.Names[_randomInames]


    const money = Math.floor(Math.random() * (100)) + 1

    const embed = new EmbedBuilder()
        .setAuthor({ name: name, url: 'https://www.youtube.com/watch?v=zrFI2gJSuwA' })
        .setTitle(response.replace("$int", currencyPrefix + money))
        .setColor(_type == "money" ? client.config.color.colorSuccess : client.config.color.colorError)

    if (_type == "money") {
        bal.wallet += money
        await client.db.user.set(user.id, "balance", bal)
    }

    interaction.reply({ embeds: [embed] }).catch(err => interaction.client.handleError(interaction, err))


}

module.exports = command