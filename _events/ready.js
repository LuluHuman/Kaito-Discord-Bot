const { Events, ActivityType } = require('discord.js');
const fs = require('fs');
module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.clear()
        console.log(`[INFO] Logged in as ${client.user.tag}!`);
        client.user.setPresence({
            activities: [{ name: `神のまにまに`, type: ActivityType.Listening }],
            status: 'dnd',
        });
        const couting = client.channels.cache.get('1176793581378351154')
        couting.messages
    },
};