const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || message.author.id == "1101327465974087731") return;
        const client = message.client;

        fs.readdirSync(path.join(__dirname, '../event_modules/messageCreate')).forEach(file => {
            const event = require(`../event_modules/messageCreate/${file}`);
            event(client, message);
        })
    },
};