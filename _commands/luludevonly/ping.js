const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { exec } = require("child_process");
const wait = require('node:timers/promises').setTimeout;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Return ping!'),

    async execute(interaction) {
        try {
            const client = interaction.client;
            const message = await interaction.deferReply({ fetchReply: true, }).catch(err => require('../../modules/handleError')(interaction, err))
            const sSince = Math.floor((Date.now() - Math.floor(process.uptime() * 1000)) / 1000)

            const f1 = [
                { name: '⏰ | ```Latency```', value: '-----' },
                { name: "> API Latency", value: `${client.ws.ping}ms`, inline: true },
                { name: "> Discord Latency", value: `${message.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: '⬆️ | ```Uptime```', value: '-----' },
                { name: "> Script Uptime", value: `<t:${sSince}:R>`, inline: true },
            ]

            const embed = new EmbedBuilder()
            embed.setAuthor({ name: "Ping", iconURL: "https://upload.wikimedia.org/wikipedia/commons/1/16/Ubuntu_and_Ubuntu_Server_Icon.png", })
            embed.setThumbnail(client.user.displayAvatarURL())
            embed.setColor("#D44600")
            embed.addFields(f1)
            embed.setTimestamp()

            var neof = false
            exec('neofetch --off', async (error, stdout, stderr) => {
                nfJson = stdout.replaceAll(/\x1B\[[0-9;]*m/g, "").replace("[?25l[?7l", "").split("\n")

                var filtered = {}

                filtered.User = nfJson.shift()

                nfJson.forEach(element => {
                    if (!element.includes(":")) return
                    const line = element.split(":")

                    if (filtered[line[0]]) {
                        filtered[line[0]] = `${filtered[line[0]]}\n* ${line[1]}`
                        return
                    }
                    
                    if (line[0] == "Memory") {
                        const val = line[1].replaceAll("MiB").split(" / ")
                        line[1] += `\n(${Math.floor((parseInt(val[0]) / parseInt(val[1])) * 100) }% Used)`
                    }
                    filtered[line[0]] = "*"+line[1]
                });

                embed.addFields([
                    { name: "> Server Uptime", value: filtered.Uptime, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: '💻 | ```System```', value: '-----' },
                    { name: '> User', value: filtered.User, inline: true },
                    { name: '> OS', value: filtered.OS, inline: true },
                    { name: '> Host', value: filtered.Host, inline: true },
                    { name: '> Kernel', value: filtered.Kernel, inline: true },
                    { name: '> Shell', value: filtered.Shell, inline: true },
                    { name: '> Memory', value: filtered.Memory, inline: true },
                    { name: '> CPU', value: filtered.CPU },
                    { name: '> GPU(s)', value: filtered.GPU },
                ])
                neof = true
            });

            while (!neof) {
                await wait(1)
            }

            await interaction.editReply({ embeds: [embed] })
                .catch(err => require('../../modules/handleError')(interaction, err))
        } catch (error) {
            require('../../modules/handleError')(interaction, error)
        }
    }
}