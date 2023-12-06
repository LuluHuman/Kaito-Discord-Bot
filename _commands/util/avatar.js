const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const command = {}
command.data = new SlashCommandBuilder().setName('avatar').setDescription('get it')
    .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
command.execute = async (interaction) => {
    const client = interaction.client;
    const target = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
    const serverAvatar = target.avatar && `https://cdn.discordapp.com/guilds/${interaction.guild.id}/users/${target.id}/avatars/${target.avatar}.png?size=512`;
    const embed = new EmbedBuilder()
        .setAuthor({
            name: `Avatar`,
            iconURL: client.user.displayAvatarURL(),
        })
        .setDescription(`> 📦 | ${target.displayName}[\`${target.id}\`]`)
        .setImage(serverAvatar || target.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor(target.displayHexColor)
        .setFooter({ text: `Request by: ${interaction.member.displayName}`, iconURL: interaction.user.displayAvatarURL(), })
        .setTimestamp();
    if (serverAvatar) { embed.setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 512 })); }

    await interaction.reply({ embeds: [embed] })
        .catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command