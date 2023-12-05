const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed }, noQueue, musicControlls, musicControllsEmbed } = require('../../modules/messageHandler')

module.exports = {
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('shuffle the queue'),
    async execute(interaction, isButton) {
        const client = interaction.client;
        const queue = client.distube.getQueue(interaction.guildId)
        if (noQueue(interaction)) return;
        queue.shuffle().catch(err => require('../../modules/handleError')(interaction, err))
        
        if (!isButton) { interaction.reply({ embeds: [titleEmbed(client, "colorBG", "queue", `Queue Shuffled`)], ephemeral: true }).catch(err => require('../../modules/handleError')(interaction, err)) }
        else { interaction.deferUpdate().catch(err => require('../../modules/handleError')(interaction, err)) }

        const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
        const msg = await MusicPlayerCn.send({ embeds: [titleEmbed(client, "colorBG", "queue", `Queue Shuffled`)] }).catch(err => require('../../modules/handleError')(interaction, err))

        setTimeout(() => {
            musicControlls(client, musicControllsEmbed(queue.songs[0], queue))
            msg.delete().catch(err => require('../../modules/handleError')(interaction, err))
        }, 5000);
    }
}
