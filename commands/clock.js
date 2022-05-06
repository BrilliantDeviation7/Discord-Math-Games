const Discord = require("discord.js");
const Database = require("@replit/database");
const db = new Database();
const cooldown = 3600; // seconds
const { SecondstoTime, deleteInvalidCommand, findUserIndex, findUserInfo } = require("../tools");

module.exports.run = (client, msg, args) => {
    const t = Date.now();
    db.get("last_reap").then(last_reap => {
        let clockMsg = new Discord.MessageEmbed()
            .setColor("YELLOW")
            .setTitle(`${Math.round((t - last_reap) / 1000)} second(s)`)
            .setDescription("Reap available!\nReact with 🕥 in the next 30s to reap!")
            .setAuthor({
                name: msg.author.username,
                iconURL: msg.author.displayAvatarURL()
            })
        db.get("start_time").then(start => {
            db.get("game_scores").then(game => {
                if (!start) return deleteInvalidCommand(msg, "Game has not started!");
                if (findUserIndex(game, msg.author.username) > -1) {
                    if ((t - findUserInfo(game, msg.author.username)[2]) < (cooldown * 1000)) {
                        clockMsg.setDescription(`${SecondstoTime(Math.round(cooldown - (t - findUserInfo(game, msg.author.username)[2]) / 1000))} until next reap!`);
                        return msg.channel.send({ embeds: [clockMsg] });
                    }
                }
                msg.channel.send({ embeds: [clockMsg] }).then(m => {
                    m.react("🕥");
                    const filter = (reaction, user) => {
                        return reaction.emoji.name === "🕥" && user.id === msg.author.id;
                    };
                    const collector = m.createReactionCollector({ filter, max: 1, time: 30000 });
                    collector.on("collect", (reaction, user) => {
                        const command = client.commands.get("reap");
                        command.run(client, msg, args);
                    });
                    collector.on("end", collected => {
                        console.log(collected);
                    });
                })
            })
        })
    })
}
exports.name = "clock"
