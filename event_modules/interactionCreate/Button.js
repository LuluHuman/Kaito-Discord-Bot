module.exports = async (interaction) => {
    if (!interaction.isButton()) return
    const client = interaction.client;
    const akiHandler = client.modules.akiHandler

    switch (interaction.customId) {
        //Music Player
        case 'shf':
        case 'stp':
        case 'plpa':
        case 'skp':
        case 'que': {
            const refTable = { 'shf': "shuffle", 'stp': "stop", 'plpa': "pause", 'skp': "skip", 'que': "queue", }
            client.commands.get(refTable[interaction.customId]).execute(interaction, true);
            break
        }
        //Redit
        case "morememes": {
            const redditModule = require("./../../modules/reddit")
            redditModule.onButtonInteraction(interaction)
            break
        }

        //TnD bot
        case "truth":
        case "dare":
        case "randomtnd": {
            if (interaction.customId == "randomtnd") interaction.customId = Math.floor(Math.random() * 2) == 0 ? 'truth' : 'dare'
            require('../../modules/tndapi/truthOrDare')(interaction.customId, interaction)
            interaction.message.edit({ components: [] }).catch(err => interaction.client.handleError(interaction, err))
            break
        }
        case "wyr": {
            require('../../modules/tndapi/wouldYouRather')(interaction)
            interaction.message.edit({ components: [] }).catch(err => interaction.client.handleError(interaction, err))
            break
        }
        case "paranoia": {
            require('../../modules/tndapi/paranoia')(interaction)
            interaction.message.edit({ components: [] }).catch(err => interaction.client.handleError(interaction, err))
            break
        }

        //Aki
        case "yesaki":
        case "noaki":
        case "dkaki":
        case "probaki":
        case "probnotaki": {
            await interaction.deferUpdate().catch(err => interaction.client.handleError(interaction, err))
            akiHandler.step(interaction)
            break
        }
        case "restartaki": {
            akiHandler.newGame(interaction)
            break
        }
        case "endaki": {
            if (!client.akigames.has(interaction.user.id)) return interaction.reply({ content: "You are not playing Akinator", ephemeral: true })
            akiHandler.end(interaction)
            break
        }

        case "tttAccept":
        case "tttDecline": { break }
        case "tttaa":
        case "tttab":
        case "tttac":
        case "tttba":
        case "tttbb":
        case "tttbc":
        case "tttca":
        case "tttcb":
        case "tttcc": {
            if (!client.tictactoePlayers.get(interaction.user.id)) return interaction.reply({ content: "You are not playing Tic Tac Toe", ephemeral: true })
            const tttModule = require("./../../modules/tictactoe")
            tttModule.step(interaction)
            break
        }
        case "tttEnd": {
            if (!client.tictactoePlayers.get(interaction.user.id)) return interaction.reply({ content: "You are not playing Tic Tac Toe", ephemeral: true })
            const tttModule = require("./../../modules/tictactoe")
            tttModule.endGame(interaction)
            break
        }
        case "highlow.higher":
        case "highlow.jackpot":
        case "highlow.lower":
        case "nexthelp":
        case "prevhelp": { break }


        default:
            interaction
                .reply({ content: `There was an error trying to execute that command\n\`No button matching id ${interaction.customId} was found.\`\n<@635303930879803412>` })
                .catch(err => interaction.client.handleError(`No button matching id ${interaction.customId} was found`, err))
            break;
    }

}
