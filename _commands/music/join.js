const { SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('join').setDescription('Join a voice channel')
command.execute = async (interaction) => {
  const client = interaction.client
  const { embed: { titleEmbed } } = client.modules.messageHandler

  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    const embed1 = titleEmbed(client, "colorWarning", "warning", 'You must be in a voice channel')
    interaction.reply({ embeds: [embed1], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err))
    return
  }

  client.distube.voices.join(voiceChannel).catch(err => interaction.client.handleError(interaction, err))
  const embed2 = titleEmbed(client, "colorSuccess", "success", 'Joined voice channel')
  interaction.reply({ embeds: [embed2] }).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command