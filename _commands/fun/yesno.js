const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const command = {}
command.data = new SlashCommandBuilder().setName('yesno').setDescription('i say yes or no')
    .addStringOption(option => option.setName('question').setDescription('The question to ask').setRequired(true))

command.execute = async (interaction) => {
    const yesno = Math.floor(Math.random() * 2) == 0 ? "Yes" : "No"
    const client = interaction.client;
    const question = interaction.options.getString('question');

    const exampleEmbed = new EmbedBuilder()
        .setColor(client.config.color.colorBG)
        .setTitle("Question: " + question)
        .setDescription(yesno)
        .setTimestamp()

    await interaction.reply({ embeds: [exampleEmbed] }).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command