const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
            require('../event_modules/interactionCreate/ChatInputCommand')(interaction);
            return
        }
        if (interaction.isButton()) {
            require('../event_modules/interactionCreate/Button')(interaction);
            return
        }
        if (interaction.isAutocomplete()) {
            require('../event_modules/interactionCreate/autocomplete')(interaction);
            return
        }
    },
};