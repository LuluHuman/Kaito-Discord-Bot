const { SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('repeat-message').setDescription('repeat a message')
    .addStringOption(option => option.setName('text').setDescription('The text you want me to say').setRequired(true))
    
command.execute = async (interaction) => {
    const text = interaction.options.getString('text');
    interaction.reply({ content: "yes", ephemeral: true }).catch(err => interaction.client.handleError(interaction, err))
    interaction.deleteReply().catch(err => interaction.client.handleError(interaction, err))
    interaction.channel.send(text).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command