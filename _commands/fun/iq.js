const { SlashCommandBuilder } = require('discord.js')
const { embed: { decideEmbed } } = require('../../modules/messageHandler')

//.catch(err => interaction.client.handleError(interaction, err))
const command = {}
command.data = new SlashCommandBuilder()
    .setName('iq')
    .setDescription('Get your IQ')
    .addUserOption(option => option.setName('user').setDescription('The user to get the IQ of'))

command.execute = async (interaction) => {
    const client = interaction.client;
    const user = interaction.options.getUser('user') || interaction.user;
    var embedText = "";

    switch (user.id) {
        case "635303930879803412":
            embedText = `<@635303930879803412> has 0 IQ (Anymore)`
            break;
        case "999715272510406797":
            embedText = `I have 0 IQ (What is my job anyway)`
            break;
        default:
            embedText = `<@${user.id}> has ${Math.floor(Math.random() * (109))} IQ`
            break;
    }
    const embed = decideEmbed(client, client.config.color.iq, "🧠", "Mason's IQ r8 machine", embedText)
    interaction.reply({ embeds: [embed] }).catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command