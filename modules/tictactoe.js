const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const namesArr = ["aa", "ab", "ac", "ba", "bb", "bc", "ca", "cb", "cc"]
const ref = { "a": 0, "b": 1, "c": 2 }

exports.optionRow = () => {
    const accept = new ButtonBuilder()
        .setCustomId("tttAccept")
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success);
    const decline = new ButtonBuilder()
        .setCustomId("tttDecline")
        .setLabel('Decline')
        .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder().addComponents(accept, decline);
    return row
}

exports.newGame = async (interaction, player1, player2) => {
    const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    const response = await interaction.fetchReply();
    const client = interaction.client
    const code = newId()

    var buttons = {}
    namesArr.forEach(name => { buttons[name] = button("ttt" + [name]) });

    const rowa = new ActionRowBuilder().addComponents(buttons.aa, buttons.ab, buttons.ac);
    const rowb = new ActionRowBuilder().addComponents(buttons.ba, buttons.bb, buttons.bc);
    const rowc = new ActionRowBuilder().addComponents(buttons.ca, buttons.cb, buttons.cc);
    // End game Button
    const end = new ButtonBuilder()
        .setCustomId("tttEnd")
        .setLabel("End Game")
        .setStyle(ButtonStyle.Danger);
    const rowend = new ActionRowBuilder().addComponents(end);

    client.tictactoe.set(code, { "id": code, "players": [player1, player2], "interaction": response, "board": board, "buttons": buttons, "turn": 0 })
    client.tictactoePlayers.set(player1, { gameId: code, opponent: player2 })
    client.tictactoePlayers.set(player2, { gameId: code, opponent: player1 })

    interaction.editReply({ content: `<@${player1}>`, embeds: [embed(":green_circle:", `<@${player1}>'s turn`, client.config.color.colorSuccess)], components: [rowa, rowb, rowc, rowend] })
        .catch(err => interaction.client.handleError(interaction, err))
}

exports.step = async (interaction) => {
    const client = interaction.client

    const _playerId = interaction.user.id
    const { gameId } = client.tictactoePlayers.get(_playerId)
    const game = client.tictactoe.get(gameId)

    // Check for player turn
    const _playerTurnId = game.players[game.turn]
    if (_playerId !== _playerTurnId) return interaction.reply({ content: "Its not your turn lah bodo", ephemeral: true })

    interaction.deferUpdate().catch(err => interaction.client.handleError(interaction, err))//!

    // Update board
    var buttons = game.buttons
    const [row, collum] = interaction.customId.replace("ttt", "").split("")
    game.board[ref[row]][ref[collum]] = game.turn + 1

    // Update buttons
    var buttons = game.buttons
    buttons[row + collum] = button("ttt" + row + collum, game.turn == 0 ? "Success" : "Danger")
    const rowa = new ActionRowBuilder().addComponents(buttons.aa, buttons.ab, buttons.ac);
    const rowb = new ActionRowBuilder().addComponents(buttons.ba, buttons.bb, buttons.bc);
    const rowc = new ActionRowBuilder().addComponents(buttons.ca, buttons.cb, buttons.cc);

    // End game Button
    const end = new ButtonBuilder()
        .setCustomId("tttEnd")
        .setLabel("End Game")
        .setStyle(ButtonStyle.Danger);
    const rowend = new ActionRowBuilder().addComponents(end);

    // Change turn
    game.turn = game.turn == 0 ? 1 : 0

    // Check for winner // tie
    const winner = checkWinner(game.board)
    if (checkTie(game) && winner == 0) return game.interaction.edit({ content: "", embeds: [embed("Match results:", "Draw\nNo money given:(", client.config.color.colorWarning)], components: [rowa, rowb, rowc] })
        .catch(err => interaction.client.handleError(interaction, err))//!

    if (winner == 0) return game.interaction.edit({
        content: "",
        embeds: [embed(game.turn == 0 ? ":green_circle:" : ":red_circle:", `<@${game.players[game.turn]}>'s turn`, client.config.color[game.turn == 0 ? "colorSuccess" : "colorError"])],
        components: [rowa, rowb, rowc, rowend]
    }).catch(err => interaction.client.handleError(interaction, err))//!


    var respTxt = ""
    if (game.players[0] == game.players[1]) {
        respTxt = "Do you expect free money by playing with yourself"
    } else {
        const money = Math.floor(Math.random() * (100)) + 1
        respTxt = `<:Dabloon:1179609875664359454>${money} given to winner`
        const bal = await client.db.user.get(game.players[winner - 1], "balance", { wallet: 0, bank: 0 })
        bal.wallet += money
        await client.db.user.set(game.players[winner - 1], "balance", bal)
    }
    game.interaction.edit({
        content: "",
        embeds: [embed("Match results:", `<@${game.players[winner - 1]}> Won\n${respTxt}`, client.config.color.colorSuccess)],
        components: [rowa, rowb, rowc]
    }).catch(err => interaction.client.handleError(interaction, err))//!
    deleteGame(client, game)
}

exports.endGame = (interaction) => {
    const client = interaction.client

    const _playerId = interaction.user.id
    const { gameId } = client.tictactoePlayers.get(_playerId)
    const game = client.tictactoe.get(gameId)

    var buttons = game.buttons
    const rowa = new ActionRowBuilder().addComponents(buttons.aa, buttons.ab, buttons.ac);
    const rowb = new ActionRowBuilder().addComponents(buttons.ba, buttons.bb, buttons.bc);
    const rowc = new ActionRowBuilder().addComponents(buttons.ca, buttons.cb, buttons.cc);

    game.interaction.edit({
        content: "",
        embeds: [embed("Game ended", `Game ended by <@${_playerId}>`, client.config.color.colorBG)],
        components: [rowa, rowb, rowc]
    }).catch(err => interaction.client.handleError(interaction, err))//!
    deleteGame(client, game)
}

function newId() {
    var code = ""
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("")
    const randomChar = (() => { return Math.floor(Math.random() * (chars.length - 1)) + 0; })
    for (let i = 0; i < 6; i++) { code += chars[randomChar()] }
    return code
}

function button(id, color) {
    const Button = new ButtonBuilder()
        .setCustomId(id)
        .setEmoji("1102056378534723594")
        .setStyle(ButtonStyle[color || "Primary"]);
    if (color) Button.setDisabled(true)
    return Button
}


function embed(title, desc, color) {
    const exampleEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
    if (desc) exampleEmbed.setDescription(desc)
    return exampleEmbed
}

function checkWinner(board) {
    for (let i = 0; i < 3; i++) {
        if ((board[i][0] !== 0 && board[i][0] === board[i][1] && board[i][0] === board[i][2]) || (board[0][i] !== 0 && board[0][i] === board[1][i] && board[0][i] === board[2][i])) return board[i][i]
    }
    if ((board[0][0] !== 0 && board[0][0] === board[1][1] && board[0][0] === board[2][2]) || (board[0][2] !== 0 && board[0][2] === board[1][1] && board[0][2] === board[2][0])) return board[1][1]
    return 0;
}

function checkTie(game) {
    let hasZero = false;
    for (let i = 0; i < game.board.length; i++) {
        for (let j = 0; j < game.board[i].length; j++) { if (game.board[i][j] === 0) { hasZero = true; break; } }
        if (hasZero) { break }
    }
    return !hasZero
}

function deleteGame(client, game) {
    client.tictactoe.delete(game.id)
    client.tictactoePlayers.delete(game.players[0])
    client.tictactoePlayers.delete(game.players[1])
}