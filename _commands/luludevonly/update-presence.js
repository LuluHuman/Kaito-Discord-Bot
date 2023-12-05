const { SlashCommandBuilder, ActivityType } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-presence')
        .setDescription('Update presence of kaito')
        .addStringOption(option =>
            option
                .setRequired(true)
                .setName('name')
                .setDescription('ex. playing.. name'))
        .addStringOption(option =>
            option.setName('activity-type')
                .setDescription('ex. listening to... playing...')
                .setRequired(true)
                .addChoices(
                    { name: 'competing', value: 'Competing' },
                    { name: 'custom', value: 'Custom' },
                    { name: 'listening', value: 'Listening' },
                    { name: 'playing', value: 'Playing' },
                    { name: 'watching', value: 'Watching' }
                ))
        .addStringOption(option =>
            option.setName('status')
                .setDescription('ex. dnd, idle ')
                .setRequired(true)
                .addChoices(
                    { name: 'dnd', value: 'dnd' },
                    { name: 'idle', value: 'idle' },
                    { name: 'online', value: 'online' }
                )),
    async execute(interaction) {
        if (interaction.user.id !== "635303930879803412") return interaction.reply({ content: "go away", components: [row] }).catch(err => require('../../modules/handleError')(interaction, err))
        const client = interaction.client
        const atype = interaction.options.getString("activity-type")
        const name = interaction.options.getString("name")
        const status = interaction.options.getString("status")
        client.user.setPresence({
            activities: [{ name: name, type: ActivityType[atype] }],
            status: status,
        });

        interaction.reply(`set status to: ${atype} ${name} ${status}`)
    }
}
