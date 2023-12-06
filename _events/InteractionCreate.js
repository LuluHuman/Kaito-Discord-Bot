const { Events } = require('discord.js');
const event = {}
event.name = Events.InteractionCreate

event.execute = async (interaction) => {
    switch (interaction.type) {
        case 2: {
            require('../event_modules/interactionCreate/ChatInputCommand')(interaction);
            break;
        }

        case 3: {
            require('../event_modules/interactionCreate/Button')(interaction);
            break;
        }
        
        case 4: {
            require('../event_modules/interactionCreate/autocomplete')(interaction);
            break;
        }

        default:
            break;
    }
}

module.exports = event