const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')
const { embed: { decideEmbed } } = require('../../modules/messageHandler')

module.exports = {
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName('repeat-message')
        .setDescription('repeat a message')
        .addStringOption(option => option.setName('text').setDescription('The text you want me to say').setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        interaction.reply({ content: "yes", ephemeral: true }).catch(err => require('../../modules/handleError')(interaction, err))
        interaction.deleteReply().catch(err => require('../../modules/handleError')(interaction, err))
        interaction.channel.send(text).catch(err => require('../../modules/handleError')(interaction, err))
    }
}