module.exports = async (interaction) => {
    const client = interaction.client
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        interaction.reply({ content: `FATAL ERROR: No command matching ${interaction.commandName} was found` })
        interaction.client.handleError(interaction, `There was an error trying to execute that command\n\`No command matching ${interaction.commandName} was found`)
        return;
    }

    if (client.commandCooldown.has(`${interaction.commandName},${interaction.user.id}`)) {
        const cooldownleft = client.commandCooldown.get(`${interaction.commandName},${interaction.user.id}`) + command.cooldown / 1000
        interaction.reply({ content: `Please wait <t:${cooldownleft}:R> before begging`, ephemeral: true })
        return
    }

    if (command.cooldown) {
        client.commandCooldown.set(`${interaction.commandName},${interaction.user.id}`, Math.floor(Date.now() / 1000));
        setTimeout(() => {
            client.commandCooldown.delete(`${interaction.commandName},${interaction.user.id}`);
        }, command.cooldown);
    }

    await command.execute(interaction)
        .catch(err => interaction.client.handleError(interaction, err))
}