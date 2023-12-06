const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const tttModule = require("./../../modules/tictactoe")

const command = {}
command.data = new SlashCommandBuilder().setName('tic-tac-toe').setDescription('plae tic-tac-toe')
    .addUserOption(option => option.setName('user').setDescription('Who you want to play with').setRequired(true))

command.execute = async (interaction) => {
    const client = interaction.client
    const user = interaction.options.getUser('user');
    const optionRow = tttModule.optionRow()

    if (client.tictactoePlayers.get(interaction.user.id)) return interaction.reply({ embeds: [embed("you are already playing")] }).catch(err => interaction.client.handleError(interaction, err))
    if (client.tictactoePlayers.get(user.id)) return interaction.reply({ embeds: [embed(`<@${user.id}> is in a match`)] }).catch(err => interaction.client.handleError(interaction, err))
    if (user.id == "999715272510406797" || user.id == "408785106942164992") return interaction.reply({ embeds: [embed("You cant play with bots???")] }).catch(err => interaction.client.handleError(interaction, err))
    if (user.id == interaction.user.id) {
        await interaction.reply({ embeds: [embed("I guess you can play with yourself?")] }).catch(err => interaction.client.handleError(interaction, err))
        setTimeout(() => {
            tttModule.newGame(interaction, user.id, interaction.user.id)
        }, 1000);
        return
    }

    const dateNow = Math.floor(Date.now() / 1000)
    await interaction.reply({
        content: `<@${user.id}> Match`,
        embeds: [embed("Match Request:", `<@${interaction.user.id}> is requesting to play Tic Tac Toe with you\nRequest closes <t:${dateNow + 62}:R> `)],
        components: [optionRow]
    }).catch(err => interaction.client.handleError(interaction, err))

    const response = await interaction.fetchReply();
    const collector = await response.createMessageComponentCollector({ time: 60000 });

    var responded = false
    collector.on('collect', async i => {
        if (i.user.id !== user.id) return await i.reply({ embeds: [embed("Match Request:", `Go away, this isn't your game`)], ephemeral: true }).catch(err => interaction.client.handleError(interaction, err))
        if (i.customId == "tttAccept") { tttModule.newGame(interaction, user.id, interaction.user.id) }
        else {
            await interaction.editReply({
                content: "",
                embeds: [embed("Match declined", `<@${user.id}> declined the request`, client.config.color.colorError)],
                components: []
            }).catch(err => interaction.client.handleError(interaction, err))
        }

        responded = true
        i.deferUpdate()
        collector.stop()
    });
    collector.on("end", () => {
        if (!responded) return interaction.editReply({ content: "", embeds: [embed("Bro took too long to respond 💀")], components: [] }).catch(err => interaction.client.handleError(interaction, err))
    })


    function embed(title, desc, color) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(color || client.config.color.colorBG)
            .setTitle(title)
        if (desc) exampleEmbed.setDescription(desc)
        return exampleEmbed
    }
}

module.exports = command