const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const currencyPrefix = "<:Dabloon:1179609875664359454> "

const begResponses = require("./../../config/begResponses.json")
const names = require("./../../config/econNames.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('beg someone for something'),
    async execute(interaction) {
        const client = interaction.client
        if (client.commandCooldown.has(`BEG,${interaction.user.id}`)) {
            const cooldownleft = client.commandCooldown.get(`BEG,${interaction.user.id}`) + 10
            interaction.reply({ content: `Please wait <t:${cooldownleft}:R> before begging`, ephemeral: true })
            return
        }
        client.commandCooldown.set(`BEG,${interaction.user.id}`, Math.floor(Date.now() / 1000));
        setTimeout(() => {
            client.commandCooldown.delete(`BEG,${interaction.user.id}`);
        }, 10000);


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

        interaction.reply({ embeds: [embed] }).catch(err => require('../../modules/handleError')(interaction, err))
        if (_type == "money") {
            bal.wallet += money
            await client.db.user.set(user.id, "balance", bal)
        }

    }
}