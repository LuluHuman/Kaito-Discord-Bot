const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { Aki } = require('aki-api');
const { buttons } = require("./messageHandler")
const attitudes = [
    "serein.png",
    "triomphe.png",
    "mobile.png",
    "confiant.png",
    "inspiration_forte.png",
    "vrai_decouragement.png",
    "defi.png",
    "inspiration_legere.png"
]

exports.newGame = async (interaction) => {
    const client = interaction.client;
    if (client.akigames.has(interaction.user.id)) { return interaction.reply({ content: "You are already playing a game bodoh", ephemeral: true }) }

    const loading = this.qnsEmbed(client, "Think of a charactar (Loading...)", interaction.user, null)
    await interaction.reply({ embeds: [loading] }).catch(err => require('./handleError')(interaction, err))

    // Load game
    const aki = new Aki({ region: 'en' });
    await aki.start()

    client.akigames.set(interaction.user.id, { "aki": aki, "message": interaction })

    const embed = this.qnsEmbed(client, aki.question, interaction.user, { text: `Question ${aki.currentStep} | Progression: ${Math.floor(aki.progress)}%` })
    const row = this.akiButton()
    const row2 = this.akiButton2()

    const response = await interaction.editReply({ embeds: [embed], components: [row, row2], });
    const collectorFilter = i => i.user.id === interaction.user.id;

    try { await response.awaitMessageComponent({ filter: collectorFilter, time: 300000 }); }
    catch (e) {
        await interaction.editReply({ content: "Timeout", components: [] }).catch(err => require('./handleError')(interaction, err))
        client.akigames.delete(interaction.user.id)
    }
}

exports.result = async (interaction, aki, message) => {
    const client = interaction.client
    await aki.win().catch(err => require('./handleError')(interaction, err))

    const restart = require("./messageHandler").buttons.createBasic("restartaki", "Restart", "Primary")
    const row = new ActionRowBuilder().addComponents(restart);
    const embed = new EmbedBuilder()
        .setTitle(`Idk lah but I ${Math.floor(aki.progress)}% sure is...`)
        .setURL('https://www.youtube.com/watch?v=BbeeuzU5Qc8')
        .setDescription(`**${aki.answers[0].name}**\n${aki.answers[0].description}\nRanking: #${aki.answers[0].ranking}\n`)
        .setColor(client.config.color.aki)
        .setImage(aki.answers[0].absolute_picture_path)
        .setAuthor({ "name": interaction.user.username, "iconURL": interaction.user.avatarURL() })
    message.editReply({ embeds: [embed], components: [row] }).catch(err => require('./handleError')(interaction, err))
    client.akigames.delete(interaction.user.id)
}
exports.step = async (interaction) => {
    const refTable = { "yesaki": 0, "noaki": 1, "dkaki": 2, "probaki": 3, "probnotaki": 4, }
    const response = refTable[interaction.customId]

    const client = interaction.client
    
    if (!client.akigames.get(interaction.user.id)) return interaction.followUp({ content: "You are not playing anything", ephemeral: true })
    const { aki, message } = client.akigames.get(interaction.user.id)

    const messageReply = await message.fetchReply()
    const responseReply = await interaction.fetchReply()

    if (interaction.user.id !== client.akigames.get(interaction.user.id).message.user.id) return interaction.followUp({ content: "This is not you're game go away", ephemeral: true })
    if (!(messageReply.id == responseReply.id)) return await interaction.followUp({ content: "This is not you're game go away", ephemeral: true })

    const drow = this.akiButton(true)
    const drow2 = this.akiButton2()
    await message.editReply({ components: [drow, drow2] }).catch(err => require('./handleError')(interaction, err))

    await aki.step(response).catch(err => require('./handleError')(interaction, err))
    if (aki.progress >= 80 || aki.currentStep >= 78) { return await exports.result(interaction, aki, message) }

    const row = this.akiButton()
    const row2 = this.akiButton2()
    const embedyes = this.qnsEmbed(client, aki.question, interaction.user, { text: `Question ${aki.currentStep} | Progression: ${Math.floor(aki.progress)}% ` })

    await message.editReply({ embeds: [embedyes], components: [row, row2] }).catch(err => require('./handleError')(interaction, err))
}
exports.end = async (interaction) => {
    const client = interaction.client;
    // const { message } = client.akigames.get(interaction.user.id)
    // const messageReply = await message.fetchReply()
    // const responseReply = await interaction.fetchReply()
    // if (!(messageReply.id == responseReply.id)) return await interaction.followUp({ content: "This is not you're game go away", ephemeral: true })
    const restart = require("./messageHandler").buttons.createBasic("restartaki", "Restart", "Primary")
    const row = new ActionRowBuilder().addComponents(restart);
    const embed = new EmbedBuilder()
        .setTitle(`Stopped`)
        .setURL('https://www.youtube.com/watch?v=BbeeuzU5Qc8')
        .setDescription(`You stopped the game.`)
        .setColor(client.config.color.aki)
        .setImage(this.randomAkitude())
        .setAuthor({ "name": interaction.user.username, "iconURL": interaction.user.avatarURL() })
    client.akigames.delete(interaction.user.id)
    interaction.message.edit({ embeds: [embed], components: [row] }).catch(err => require('./handleError')(interaction, err))
}

this.randomAkitude = () => {
    const _assetFolder = "https://raw.githubusercontent.com/LuluHuman/luluhuman.github.io/main/assets/"
    const _randomAkiIndex = Math.floor(Math.random() * (attitudes.length - 1))
    const _randomAki = attitudes[_randomAkiIndex]
    return _assetFolder + _randomAki
}

this.qnsEmbed = (client, title, user, footer) => {
    const qnsEmbed = new EmbedBuilder()
        .setTitle(title)
        .setURL('https://www.youtube.com/watch?v=BbeeuzU5Qc8')
        .setColor(client.config.color.aki)
        .setThumbnail(this.randomAkitude())
        .setAuthor({ "name": user.username, "iconURL": user.avatarURL() })
        .setFooter(footer)
    return qnsEmbed
}

this.akiButton = function (isDisabled) {
    const pref = isDisabled ? "createDisabled" : "createBasic"
    const yesaki = buttons[pref]("yesaki", "Yes", "Primary")
    const noaki = buttons[pref]("noaki", "No", "Primary")
    const dkaki = buttons[pref]("dkaki", "Idk bro", "Primary")
    const probaki = buttons[pref]("probaki", "Probably", "Primary")
    const pronnotaki = buttons[pref]("probnotaki", "Probably Not", "Primary")
    const row = new ActionRowBuilder().addComponents(yesaki, noaki, dkaki, probaki, pronnotaki);
    return row
}

this.akiButton2 = function () {
    const endaki = buttons.createBasic("endaki", "End", "Danger")
    const row = new ActionRowBuilder().addComponents(endaki);
    return row
}