const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas')


const command = {}
command.data = new SlashCommandBuilder().setName('xp').setDescription('shows your xp')
    .addUserOption(option => option.setName('user').setDescription('user to show xp of').setRequired(false))

command.execute = async (interaction) => {
    const client = interaction.client

    const user = interaction.options.getUser('user') || interaction.user
    await interaction.deferReply().catch(err => interaction.client.handleError(interaction, err))

    var xp = await client.db.user.get(user.id, "xp", 0)
    var lvl = Math.floor(xp / 1000)

    const img = await loadImage("https://raw.githubusercontent.com/LuluHuman/luluhuman.github.io/main/assets/xpbg.png")
    const avatarUrl = await user.displayAvatarURL({ extension: 'jpg' })
    var avatar = await loadImage(avatarUrl)

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.fillStyle = 'White';
    ctx.textAlign = 'left';
    ctx.font = '50pt Arial';
    ctx.fillText(`${user.username}`, 480, 105);
    ctx.fillText(`LVL: ${lvl}`, 480, 245);
    ctx.fillText(`XP: ${xp}/ ${(Math.floor(xp / 1000) * 1000) + 1000}`, 480, 377);
    ctx.drawImage(avatar, 44.3, 44.3, 354.4, 354.4);

    buf = canvas.toBuffer();
    const attachment = new AttachmentBuilder(buf, "xp.png")
    interaction.editReply({
        files: [attachment]
    }).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command