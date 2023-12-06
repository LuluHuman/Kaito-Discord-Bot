const { SlashCommandBuilder } = require('discord.js');
const akiHandler = require("../../modules/aki")

const command = {}
command.data = new SlashCommandBuilder().setName('aki').setDescription('Play a game of Akinator!')
command.execute = async (interaction) => {akiHandler.newGame(interaction)}
module.exports = command