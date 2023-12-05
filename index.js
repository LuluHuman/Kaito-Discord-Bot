const { embed: { songinfoEmbed, titleEmbed, playlistinfoEmbed }, musicControlls, musicControllsEmbed } = require('./modules/messageHandler')
const config_bot = require("./config/bot.json")
const congig_options = require("./config/options")

const { DisTube } = require('distube')
const Discord = require("discord.js")
const fs = require("fs")
const path = require("path")


const client = new Discord.Client(congig_options.Discord)
client.commands = new Discord.Collection()
client.commandCooldown =  new Discord.Collection();
client.akigames = new Discord.Collection()
client.distube = new DisTube(client, congig_options.DisTube)
client.xpTimer = new Map()

client.tictactoe = new Discord.Collection()
client.tictactoePlayers = new Discord.Collection()

client.config = {}
client.config.config_bot = config_bot
client.db = require("./modules/db")
client.config.color = require("./config/color_config.json")
client.config.emojis = require("./config/emojis.json")

client.random = require("./modules/random")

const foldersPath = path.join(__dirname, '_commands');  
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            command.catorgory = folder
            client.commands.set(command.data.name, command);
            console.log(`[INFO] Loaded command ${command.data.name} from ${filePath}`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, '_events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    client[event.once ? "once" : "on"](event.name, (...args) => event.execute(...args));
}


try {
    client.distube
        .on('playSong', (queue, song) => {
            musicControlls(client, musicControllsEmbed(song, queue))
            queue.textChannel.send({
                embeds: [songinfoEmbed(song, queue)]
            })
        })
        .on('finish', queue => {
            musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))
            queue.textChannel.send({ embeds: [titleEmbed(client, "colorBG", "stop", `Stopped - End of queue`)] })
        })
        .on('addSong', (queue, song) => queue.textChannel.send({ embeds: [songinfoEmbed(song, queue, true)] }))
        .on('addList', (queue, playlist) => {
            if (client.addingPlaylist && queue.paused) queue.resume(); client.addingPlaylist = false
            queue.textChannel.send({ embeds: [playlistinfoEmbed(playlist, queue, true)] })
        })
        .on('empty', channel => {
            musicControlls(client, titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`))
            channel.send({ embeds: [titleEmbed(client, "colorBG", "stop", `Nothing is currently playing`)] })
        })
        .on('error', (channel, e) => {
            if (channel) channel.send({ embeds: [titleEmbed(client, "colorError", "error", `An error encountered: ${e.toString().slice(0, 1974)}`)] })
        })

} catch (error) {
    console.log(error);
}

client.login(config_bot.token)