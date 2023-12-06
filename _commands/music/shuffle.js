const { SlashCommandBuilder } = require('discord.js')
const command = {}
command.data = new SlashCommandBuilder().setName('shuffle').setDescription('shuffle the queue')
command.execute = async (interaction, isButton) => {
    const client = interaction.client;
    const { embed: { titleEmbed }, noQueue, musicControlls, musicControllsEmbed } = client.modules.tttModule

    const queue = client.distube.getQueue(interaction.guildId)
    if (noQueue(interaction)) return;
    
    queue.shuffle().catch(err => interaction.client.handleError(interaction, err))

    if (!isButton) { interaction.reply({ embeds: [titleEmbed(client, "colorBG", "queue", `Queue Shuffled`)], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err)) }
    else { interaction.deferUpdate().catch(err => interaction.client.handleError(interaction, err)) }

    const MusicPlayerCn = client.channels.cache.get('1177017927447351427')
    const msg = await MusicPlayerCn.send({ embeds: [titleEmbed(client, "colorBG", "queue", `Queue Shuffled`)] }).catch(err => interaction.client.handleError(interaction, err))

    setTimeout(() => {
        musicControlls(client, musicControllsEmbed(queue.songs[0], queue))
        msg.delete().catch(err => interaction.client.handleError(interaction, err))
    }, 5000);
}

module.exports = command