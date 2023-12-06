const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('generate-button').setDescription('generate button from id')
    .addStringOption(option => option.setName('id').setDescription('id').setRequired(true))
command.execute = async (interaction) => {
    if (interaction.user.id !== "635303930879803412") return interaction.reply({ content: "go away", components: [row] }).catch(err => interaction.client.handleError(interaction, err))

    const id = interaction.options.getString('id');

    const btn = new ButtonBuilder()
        .setCustomId(id)
        .setLabel('Dont click me!')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
        .addComponents(btn);


    interaction.reply({ content: "button with id: " + id, components: [row] })
        .catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command