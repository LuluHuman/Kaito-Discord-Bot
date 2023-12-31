module.exports = async (interaction) => {
    const client = interaction.client;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.autocomplete(interaction).catch(err => interaction.client.handleError(interaction, err))
    } catch (error) {
        console.error(error);
    }
}