const ytsr = require('@distube/ytsr');
const { SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('play').setDescription('Play a song')
  .addStringOption(option =>
    option.setName('song').setDescription('Song URL/Name')
      .setRequired(true)
      .setAutocomplete(true))
  .addBooleanOption(option =>
    option.setName('next').setDescription('Play next or not'))

command.execute = async (interaction) => {
  await interaction.deferReply()
  const client = interaction.client;
  const { embed: { titleEmbed, songinfoEmbed } } = client.modules.messageHandler

  const keyword = interaction.options.getString("song");
  const next = interaction.options.getBoolean("next");
  const queue = await client.distube.getQueue(interaction);
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) return interactionReply('You need to be in a voice channel to play music', { error: true })
  if (queue && !(interaction.guild.members.me.voice.channelId == interaction.member.voice.channelId)) return interactionReply('You are not in the same voice channel', { error: true })

  await interactionReply("colorBG", "search", 'Searching...')

  if (next) {
    client.distube.play(voiceChannel, keyword, {
      member: interaction.member,
      textChannel: interaction.channel,
      interaction,
      position: 1
    }).then(async () => interactionReply("colorSuccess", "success", keyword + " added to queue"))
      .catch(err => interaction.client.handleError(interaction, err))
  } else {
    client.distube.play(voiceChannel, keyword, {
      member: interaction.member,
      textChannel: interaction.channel,
      interaction
    }).then(async () => interactionReply("colorSuccess", "success", keyword + " added to queue"))
      .catch(err => interaction.client.handleError(interaction, err))
  }


  async function interactionReply(color, emoji, title) {
    if (emoji.error) { title = color; color = "colorError"; emoji = "error" }
    return await interaction.editReply({ embeds: [titleEmbed(client, color, emoji, title)], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err))
  }
}

command.autocomplete = async (interaction) => {
  const focusedOption = interaction.options.getFocused(true).value.toLowerCase()
  if (focusedOption == "" || !focusedOption) return interaction.respond([]);
  if (focusedOption.startsWith("https://")) return interaction.respond([]);

  const searchResults = await ytsr(focusedOption, { limit: 5 }).catch(err => interaction.client.handleError(interaction, err))
  const formated = searchResults.items.map(searchResults => ({
    name: `${searchResults.name.length + searchResults.author.name.length > 80 ?
      searchResults.name.substring(0, 70 - searchResults.author.name.length) + "..." :
      searchResults.name
      } - ${searchResults.author.name}`, value: searchResults.url
  }))

  await interaction.respond(formated);
}

module.exports = command