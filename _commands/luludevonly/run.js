const { SlashCommandBuilder } = require('discord.js')
// const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
// const { get } = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('run')
        .setDescription('Run a command'),
    async execute(interaction) {
        // const user1 = interaction.guild.members.cache.get("999715272510406797")
        // console.log(user1.presence);
        // interaction.reply(JSON.stringify(user1.presence))
    }
}
