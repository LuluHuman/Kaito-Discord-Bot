const { SlashCommandBuilder } = require('discord.js')
module.exports = {
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName('aww')
        .setDescription('Get aww'),
    async execute(interaction) {
        
        interaction.reply("Diabled cos gay").catch(err => require('../../modules/handleError')(interaction, err))
    }
}