module.exports = (interaction, error) => {
    if (error == "DiscordAPIError[10062]: Unknown interaction") return interaction.channel.send({ content: `Sorry guys my internet poo poo to get that request so it timeout :( Try that again` })
    console.log(error, `\nError executing ${interaction.commandName}`);
    interaction.channel.send({
        content: `There was an error trying to execute that command\n` +
            `at ${interaction.commandName ? interaction.commandName : "<UNKNOWN>"} \`\`\`\n` +
            error +
            `\n\`\`\`\n<@635303930879803412>\n`
    });
}