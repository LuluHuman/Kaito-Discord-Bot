module.exports = async (interaction) => {
    await interaction.deferReply()
        .catch(err => interaction.client.handleError(interaction, err))

    const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
    const { get } = require('axios');

    const res = await get(`https://api.truthordarebot.xyz/api/paranoia`).catch(err => interaction.client.handleError(interaction, err))
    if (!res) {
        interaction.client.handleError(interaction, "res = undefined in paranoia.js")
    }
    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Requested by: ' + interaction.user.username, iconURL: interaction.user.avatarURL() })
        .setTitle(res.data.question)
        .setColor('#dd8844')
        .setFooter({ text: `Rating: ${res.data.rating} | ID: ${res.data.id}` });

    const label = new ButtonBuilder()
        .setCustomId('noid')
        .setDisabled(true)
        .setLabel('Discus ↓↓↓')
        .setStyle(ButtonStyle.Secondary);
    const next = new ButtonBuilder()
        .setCustomId('paranoia')
        .setLabel('Next Qn')
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder()
        .addComponents(label, next);


    interaction.editReply({ embeds: [embed], components: [row] })
        .catch(err => interaction.client.handleError(interaction, err))
}