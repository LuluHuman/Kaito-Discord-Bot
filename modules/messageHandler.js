const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

exports.embed = {}
exports.embed.titleEmbed = function (client, color, emote, title) {
    const embed = new EmbedBuilder()
        .setColor(client.config.color[color])
        .setAuthor({ name: client.config.emojis[emote] })
        .setTitle(`${title}`)
    return embed
}
exports.embed.decideEmbed = function (client, color, emote, title, desc) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title + emote)
        .setDescription(desc)
        .setTimestamp()
        .setFooter({ text: 'In memory of MasonBot (2021)', iconURL: "https://cdn.discordapp.com/attachments/821589662635393075/856808905690447913/8QTN5DD.png" });

    return embed
}
exports.embed.queueSnippet = function (queue, paused) {
    const pause = paused === true ? 'Paused' : 'Resumed'
    const embed = new EmbedBuilder()
        .setColor("#2B2D31")
        .setAuthor({ name: "Song " + pause })
        .setTitle(`${queue.songs[0].name} ${pause}`)
        .setDescription(queue.songs[1] ? `**${queue.songs[1].name}** up next` : 'No more songs in queue')
    return embed
}
exports.embed.songinfoEmbed = function ({ source, name, formattedDuration, url, thumbnail, views, likes, uploader, user }, queue, addQueue) {
    const embed = new EmbedBuilder()
        .setColor(source === 'youtube' ? '#FF0000' : '#F26F23')
        .setTitle(`${addQueue ? 'Added song to queue' : 'Now Playing'}: ${name}`)
        .setDescription(
            `Requested by: ${user}
            
            ⏳ ${formattedDuration} / ${queue.formattedCurrentTime}
            🔉 ${queue.volume}%  |  🔁 ${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'}
            `
        )
        .setURL(url)
        .setAuthor({ name: uploader.name, url: uploader.url })
        .setImage(thumbnail)
        .setTimestamp()
    return embed
}
exports.embed.playlistinfoEmbed = function (playlist, queue, addQueue) {
    if (!queue) queue = { volume: "...", repeatMode: 0 }
    const embed = new EmbedBuilder()
        .setColor(playlist.source === 'youtube' ? '#FF0000' : '#1DB954')
        .setTitle(`${addQueue ? 'Added playlist to queue' : 'Now Playing'}: ${playlist.name}`)
        .setDescription(`Requested by: ${playlist.user}`)
        .setURL(playlist.url)
        .setThumbnail(playlist.thumbnail)
        .addFields(
            { name: '🎵Songs', value: String(playlist.songs.length), inline: true },
            { name: '⚠️Warning', value: "Playlist converted from Spotify to Youtube. May contain outros" },
        )
        .addFields(
            { name: '🔉Volume', value: queue.volume + "%", inline: true },
            { name: '🔁Loop', value: queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off', inline: true }
        )
        .setTimestamp()
    return embed
}

exports.buttons = {}
exports.buttons.createBasic = (id, label, color) => {
    const Button = new ButtonBuilder()
        .setCustomId(id)
        .setLabel(label)
        .setStyle(ButtonStyle[color]);
    return Button
}
exports.buttons.createDisabled = (id, label, color) => {
    const Button = new ButtonBuilder()
        .setCustomId(id)
        .setLabel(label)
        .setStyle(ButtonStyle[color])
        .setDisabled(true);
    return Button
}


exports.noQueue = function (interaction) {
    const client = interaction.client;
    const queue = client.distube.getQueue(interaction)

    if (queue) return false
    const embed1 = exports.embed.titleEmbed(client, "colorWarning", "warning", 'There is nothing playing!')
    interaction.reply({ embeds: [embed1], ephemeral: true });
    return true
}

exports.musicControlls = function (client, embed) {
    const MusicPlayerCn = client.channels.cache.get(client.config.config_bot.MusicPlayerChannel)
    const messges = MusicPlayerCn.messages.fetch(client.config.config_bot.MusicPlayerMessage)
    messges.then(msg => msg.edit({ embeds: [embed], content: `` }))
}

exports.musicControllsEmbed = function ({ source, name, formattedDuration, url, thumbnail, views, uploader, user, duration }, queue, addQueue) {

    const embed = new EmbedBuilder()
        .setColor(source === 'youtube' ? '#FF0000' : '#F26F23')
        .setTitle(`Now Playing:\n${name}`)
        .setDescription(
            `Requested by: ${user}
            
            ⏳ ${formattedDuration} / ${queue.formattedCurrentTime}
            🔉 ${queue.volume}%  |  🔁 ${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'}
            `
        )
        .setURL(url)
        .setAuthor({ name: uploader.name, url: uploader.url })
        .addFields({ name: '📄Up next', value: queue.songs[1] ? queue.songs[1].name : 'No more songs in queue', inline: false })
        .setImage(thumbnail)
        .setTimestamp()
    return embed
}

