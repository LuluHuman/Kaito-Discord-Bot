const { SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName('owoify')
        .setDescription('OwOify a yowr message OwO :3')
        .addStringOption(option => option.setName('message').setDescription('Yowr message two OwOify').setRequired(true)),
    async execute(interaction) {
        interaction.reply({ content: "OwOified yowr message OwO :3", ephemeral: true }).catch(err => require('../../modules/handleError')(interaction, err))
        const message = interaction.options.getString('message');
        const { data } = await axios.get(`https://nekos.life/api/v2/owoify?text=${encodeURIComponent(message)}`).catch(err => require('../../modules/handleError')(interaction, err))
        interaction.channel.send({ content: data.owo}).catch(err => require('../../modules/handleError')(interaction, err))
    }
}