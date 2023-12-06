const { SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('aww').setDescription('Get aww')
command.execute = async (interaction) => interaction.reply("Diabled cos gay").catch(err => interaction.client.handleError(interaction, err))
module.exports = command