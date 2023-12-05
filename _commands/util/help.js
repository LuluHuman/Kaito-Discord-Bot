const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js')
const cmdIds = require("../../config/cmdIDs.json")
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Helo im under the water please help me'),
  async execute(interaction) {
    const client = interaction.client
    const sortedCommands = {}
    const dateNow = Math.floor(Date.now() / 1000)

    client.commands.forEach(cmd => {
      if (!sortedCommands[cmd.catorgory]) sortedCommands[cmd.catorgory] = []
      cmd.id = cmdIds[cmd.data.name]
      sortedCommands[cmd.catorgory].push(cmd)
    })

    const s = Object.keys(sortedCommands)[0]
    const row = selectRow(s)
    const response = await interaction.reply({ content: `Responses close <t:${dateNow + 62}:R>`, embeds: [helpEmbed("econamy")], components: [row], })
      .catch(err => require('../../modules/handleError')(interaction, err))
    const collectorFilter = i => i.user.id === interaction.user.id;
    const collector = await response.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });

    collector.on('collect', async i => {
      const selection = i.values[0];
      const row = selectRow(selection)
      await interaction.editReply({ embeds: [helpEmbed(selection)], components: [row], })
        .catch(err => require('../../modules/handleError')(interaction, err))
      i.deferUpdate().catch(err => require('../../modules/handleError')(interaction, err))
    });
    collector.on("end", () => {
      interaction.editReply({ content: "", components: [] }).catch(err => require('../../modules/handleError')(interaction, err)).catch(err => require('../../modules/handleError')(interaction, err))
    })
    
    //

    function helpEmbed(page) {
      const catorgoryCommands = sortedCommands[page]
      const help = new EmbedBuilder()
        .setTitle('Commands - ' + page)
        .setColor('#DD8844')
      catorgoryCommands.forEach(cmd => {
        help.addFields({ name: `</${cmd.data.name}:${cmd.id}>`, value: "<:reply:1180316937947984044>" + cmd.data.description })
      })
      return help
    }

    function selectRow(selected) {
      const select = new StringSelectMenuBuilder().setCustomId('helpMenu').setPlaceholder('Make a selection!')
      for (const catorgory in sortedCommands) {
        if (catorgory == selected) { select.addOptions(new StringSelectMenuOptionBuilder().setLabel(catorgory).setValue(catorgory).setDefault(true)) }
        else { select.addOptions(new StringSelectMenuOptionBuilder().setLabel(catorgory).setValue(catorgory)) }
      }
      const row = new ActionRowBuilder().addComponents(select);
      return row
    }

  }
}
