const { SlashCommandBuilder } = require('discord.js')
// const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
// const { get } = require('axios');

const command = {}
command.data = new SlashCommandBuilder().setName('run').setDescription('Run a command')
command.execute = async (interaction) => {
        // const user1 = interaction.guild.members.cache.get("999715272510406797")
        // console.log(user1.presence);
        // interaction.reply(JSON.stringify(user1.presence))
}

module.exports = command