const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed } } = require('../../modules/messageHandler')

const command = {}
command.data = new SlashCommandBuilder().setName('fix').setDescription('fix if not playing')
command.execute = async (interaction) => {
    const guild = interaction.guild
    const client = interaction.client
    const me = guild.members.cache.get(client.user.id)
    const fixVc = client.channels.cache.get(client.config.config_bot.fix_vc_id)
    const curVs = me.voice.channel

    me.voice.setChannel(fixVc).catch(err => interaction.client.handleError(interaction, err))
    setTimeout(() => { me.voice.setChannel(curVs) }, 1000)
    interaction.reply({ embeds: [titleEmbed(client, "colorBG", "success", "Fixed")] }).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command