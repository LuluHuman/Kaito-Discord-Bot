const { SlashCommandBuilder } = require('discord.js');
const akiHandler = require("../../modules/aki")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aki')
        .setDescription('Play a game of Akinator!'),

    async execute(interaction) {
        akiHandler.newGame(interaction)
    }
}