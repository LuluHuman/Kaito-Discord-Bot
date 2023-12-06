const { SlashCommandBuilder } = require('discord.js')
const axios = require('axios')

const command = {}
command.data = new SlashCommandBuilder().setName('owoify').setDescription('OwOify a yowr message OwO :3')
    .addStringOption(option => option.setName('message').setDescription('Yowr message two OwOify').setRequired(true))

command.execute = async (interaction) => {
    interaction.reply({ content: "OwOified yowr message OwO :3", ephemeral: true }).catch(err => interaction.client.handleError(interaction, err))
    const message = interaction.options.getString('message');
    const { data } = await axios.get(`https://nekos.life/api/v2/owoify?text=${encodeURIComponent(message)}`).catch(err => interaction.client.handleError(interaction, err))
    interaction.channel.send({ content: data.owo }).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command