exports.memeEmbed = async (client, sub, interaction) => {
    const { EmbedBuilder } = require('discord.js')
    const axios = require('axios');
    const subreddits = {
        "memes": [
            'memes',
            'dankmemes',
            'funny',
            "AnimeFunny",
            "Animemes",
            "technicallythetruth",
            "funnysigns",
            "egg_irl"
        ]
    }
    const subr = subreddits[sub][Math.floor(Math.random() * subreddits[sub].length)]
    const { data } = await axios.get(`https://www.reddit.com/r/${subr}.json?limit=500&count=500`).catch(err => interaction.client.handleError(interaction, err))
    const randNO = Math.floor(Math.random() * data.data.children.length)

    var post = data.data.children[randNO].data
    if (post.crosspost_parent_list) post = post.crosspost_parent_list
    const embed = new EmbedBuilder()
        .setColor(client.config.color.reddit)
        .setTitle((post.is_video ? "[Vid] " : "[Img] ") + post.title)
        .setDescription(`👍 ${post.ups} | 💬 ${post.num_comments}\nPosted at: <t:${post.created}:R>\nPosted on: r/${subr}`)
        .setURL("https://www.reddit.com" + post.permalink)
        .setAuthor({ name: `Posted by: ${post.author}`, iconURL: "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-144x144.png" })
        .setTimestamp()
        .setFooter({ text: 'In memory of MasonBot (2021)', iconURL: "https://cdn.discordapp.com/attachments/821589662635393075/856808905690447913/8QTN5DD.png" });
    if (post.is_video) {
        embed.setImage(post.thumbnail)
    } else {
        embed.setImage(post.url)
    }

    return embed;
}

exports.onButtonInteraction = async (interaction) => {
    const { ActionRowBuilder } = require('discord.js');

    const client = interaction.client
    interaction.deferReply().catch(err => interaction.client.handleError(interaction, err))
    const embed = await exports.memeEmbed(client, "memes", interaction)
    const morememes = require("../modules/messageHandler").buttons.createBasic("morememes", "More Memes", "Success")
    const row = new ActionRowBuilder().addComponents(morememes);
    interaction.editReply({ embeds: [embed], components: [row] }).catch(err => interaction.client.handleError(interaction, err))
    interaction.message.edit({ components: [] }).catch(err => interaction.client.handleError(interaction, err))
    return
}