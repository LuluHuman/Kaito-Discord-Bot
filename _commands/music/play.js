const ytsr = require('@distube/ytsr');
const { SlashCommandBuilder } = require('discord.js')
const { embed: { titleEmbed } } = require('../../modules/messageHandler')

module.exports = {
  inVoiceChannel: true,
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Song URL/Name')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction) {
    await interaction.deferReply()

    const client = interaction.client;
    const keyword = interaction.options.getString("song");
    const queue = await client.distube.getQueue(interaction);
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interactionReply('You need to be in a voice channel to play music', { error: true })
    if (queue && !(interaction.guild.members.me.voice.channelId == interaction.member.voice.channelId)) return interactionReply('You are not in the same voice channel', { error: true })

    await interactionReply("colorBG", "search", 'Searching...')

    client.distube.play(voiceChannel, keyword, {
      member: interaction.member,
      textChannel: interaction.channel,
      interaction
    }).catch(err => require('../../modules/handleError')(interaction, err))

    // Functions
    async function interactionReply(color, emoji, title) {
      if (emoji.error) {
        title = color
        color = "colorError"
        emoji = "error"
      }
      return await interaction.editReply({embeds: [titleEmbed(client, color, emoji, title)],ephemeral: true}).catch(err => require('../../modules/handleError')(interaction, err))
    }
  }, 
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true).value.toLowerCase()
    if (focusedOption == "") return interaction.respond([{ name: "Phony", value: "https://www.youtube.com/watch?v=zBePOfn5FIg&t=87s" }]);

    const searchResults = await ytsr(focusedOption, { limit: 5 });
    console.log(searchResults.items.map(searchResults => ({ name: `${searchResults.name} - ${searchResults.author.name}`, value: searchResults.url })));
    const formated = searchResults.items.map(searchResults => ({
      name: `${searchResults.name.length + searchResults.author.name.length > 80 ?
          searchResults.name.substring(0, 70 - searchResults.author.name.length) + "..." :
          searchResults.name
        } - ${searchResults.author.name}`, value: searchResults.url
    }))

    await interaction.respond(formated);
  }
}