//? Modules
const congig_options = require("./config/options")

const { DisTube } = require('distube')
const Discord = require("discord.js")
const fs = require("fs")
const path = require("path")

const client = new Discord.Client(congig_options.Discord)

//? Command collections
client.commands = new Discord.Collection()
client.commandCooldown = new Discord.Collection();
client.xpTimer = new Discord.Collection()

//? Games collections
client.akigames = new Discord.Collection()
client.tictactoe = new Discord.Collection()
client.tictactoePlayers = new Discord.Collection()

//? Music
client.distube = new DisTube(client, congig_options.DisTube)

//? Config
client.config = {}
client.config.config_bot = require("./config/bot.json")
client.config.color = require("./config/color_config.json")
client.config.emojis = require("./config/emojis.json")
client.config.begResponses = require("./config/begResponses.json")
client.config.names = require("./config/econNames.json")

//? Modules
client.modules = {}
client.modules.akiHandler = require("./modules/aki")
client.modules.messageHandler = require("./modules/messageHandler")
client.modules.reddit = require("./modules/reddit")
client.modules.tttModule = require("./modules/tictactoe")


//? Database
client.db = require("./modules/db")
client.random = require("./modules/random")

//? Handle error
client.handleError = require('./modules/handleError')

try {//! Idk what im doing with the try catch here

    //? Load _commands
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

    //? Load _events
    const eventsPath = path.join(__dirname, '_events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        client[event.once ? "once" : "on"](event.name, (...args) => event.execute(...args));
    }

    //? Load _distubeEvents
    const dteventsPath = path.join(__dirname, '_distubeEvents');
    const dteventFiles = fs.readdirSync(dteventsPath).filter(file => file.endsWith('.js'));
    for (const file of dteventFiles) {
        const filePath = path.join(dteventsPath, file);
        const event = require(filePath);

        client.distube.on(file.replace(".js", ""), (...args) => event(client, ...args));
    }
} catch (error) {console.error(error)}

client.login(client.config.config_bot.token)