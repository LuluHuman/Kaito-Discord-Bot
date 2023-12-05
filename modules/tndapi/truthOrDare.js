module.exports = async (type, interaction) => {
    await interaction.deferReply()
        .catch(err => require('../modules/handleError')(interaction, err))

    const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
    const { get } = require('axios');

    const res = await get(`https://api.truthordarebot.xyz/api/${type}`)
        .catch(err => require('./handleError')(interaction, err))
    if (!res) {
        require('./handleError')(interaction, "No res = undefined in TruthOrDare")
    }
    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Requested by: ' + interaction.user.username, iconURL: interaction.user.avatarURL() })
        .setTitle(res.data.question)
        .setColor(type == "truth" ? '#00FF00' : '#FF0000')
        .setFooter({ text: `Type: ${res.data.type} | Rating: ${res.data.rating} | ID: ${res.data.id}` });


    const truth = new ButtonBuilder()
        .setCustomId('truth')
        .setLabel('Truth')
        .setStyle(ButtonStyle.Success);

    const dare = new ButtonBuilder()
        .setCustomId('dare')
        .setLabel('Dare')
        .setStyle(ButtonStyle.Danger);

    const random = new ButtonBuilder()
        .setCustomId('randomtnd')
        .setLabel('Random')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
        .addComponents(truth, dare, random);


    interaction.editReply({ embeds: [embed], components: [row] })
        .catch(err => require('./handleError')(interaction, err))
}