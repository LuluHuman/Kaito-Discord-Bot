const { SlashCommandBuilder } = require('discord.js')

const command = {}
command.data = new SlashCommandBuilder().setName('clearvent').setDescription('clears <#1149711134300053524>')
command.execute = async (interaction) => {
    const client = interaction.client
    if (interaction.channel.id !== "1149711134300053524") return interaction.reply("You can't use this command here")
        .catch(err => interaction.client.handleError(interaction, err))

    const couting = client.channels.cache.get('1149711134300053524')

    couting.messages.fetch().then(messages => {
        couting.bulkDelete(messages)
            .catch(err => interaction.client.handleError(interaction, err))
    })
        .catch(err => interaction.client.handleError(interaction, err))

    interaction.reply(`<:verifiedUser:1104663350807371858> Messages removed for privacy, request by <@${interaction.user.id}> 
\`\`\`Vent rules:
- Whatever is here stays here
- Do not discriminate\`\`\``)
        .catch(err => interaction.client.handleError(interaction, err))
}

module.exports = command