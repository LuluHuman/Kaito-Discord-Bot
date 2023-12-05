const { REST, Routes } = require('discord.js');
const { token, id } = require('../config/bot.json');
const fs = require('node:fs');
const path = require('node:path');
const commands = [];
const foldersPath = path.join(__dirname, '../_commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST().setToken(token);

// rest.delete(Routes.applicationCommand("999715272510406797", '1180364656049672302'))
//     .then(() => console.log('Successfully deleted application command'))
//     .catch(console.error);
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Routes.applicationCommands("999715272510406797"), { body: commands },).catch((err) => { console.log(err); })
        if (data) {
            const cmdIds = {}
            data.forEach(cmd => {
                cmdIds[cmd.name] = cmd.id
            });
            fs.writeFileSync("/home/lulu/KaitoBot/config/cmdIDs.json",JSON.stringify(cmdIds))
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }else{
            console.log(`Unable to load application (/) commands.`);
        }
    } catch (error) {
        console.error(error);
    }
})();