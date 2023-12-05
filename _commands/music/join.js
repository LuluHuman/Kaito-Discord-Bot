const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed } } = require('../../modules/messageHandler')

module.exports = {
  inVoiceChannel: true,
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join a voice channel'),
  async execute(interaction) {

    const client = interaction.client
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      const embed1 = titleEmbed(client, "colorWarning", "warning", 'You must be in a voice channel')
      interaction.reply({ embeds: [embed1], ephemeral: true }).catch(err => require('../../modules/handleError')(interaction, err))
      return
    }
    
    client.distube.voices.join(voiceChannel).catch(err => require('../../modules/handleError')(interaction, err))
    const embed2 = titleEmbed(client, "colorSuccess", "success", 'Joined voice channel')
    interaction.reply({ embeds: [embed2]  }).catch(err => require('../../modules/handleError')(interaction, err))
  }
}
