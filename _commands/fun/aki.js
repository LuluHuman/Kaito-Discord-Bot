const { SlashCommandBuilder } = require('discord.js');

const command = {}
command.data = new SlashCommandBuilder().setName('aki').setDescription('Play a game of Akinator!')
command.execute = async (interaction) => { client.modules.akiHandler.newGame(interaction)}
module.exports = command