const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed } } = require('../../modules/messageHandler')

module.exports = {
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName('fix')
        .setDescription('fix if not playing'),
    async execute(interaction) {
        const guild = interaction.guild
        const client = interaction.client
        const me = guild.members.cache.get(client.user.id)
        const fixVc = client.channels.cache.get(client.config.config_bot.fix_vc_id)
        const curVs = me.voice.channel

        me.voice.setChannel(fixVc).catch(err => require('../../modules/handleError')(interaction, err))
        setTimeout(() => {me.voice.setChannel(curVs)}, 1000)
        interaction.reply({ embeds: [titleEmbed(client, "colorBG", "success", "Fixed")] }).catch(err => require('../../modules/handleError')(interaction, err))
    }
}
