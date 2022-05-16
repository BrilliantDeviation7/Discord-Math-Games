const Discord = require("discord.js");
const Database = require("@replit/database");
const db = new Database();
const { deleteInvalidCommand, findUserInfo, findUserIndex } = require("../tools");

module.exports.run = async (client, msg, args) => {
    let game = await db.get("game_scores");
    if (args.length < 1) return deleteInvalidCommand(msg, "Invalid recipient username!");
    const recipient = await client.users.fetch(args[0].replace("<", "").replace("@", "").replace(">", ""));
    if (!recipient) return deleteInvalidCommand(msg, "Invalid recipient username!");
    if (findUserIndex(game, recipient.id) === -1) return deleteInvalidCommand(msg, `${recipient.username.slice(0, 16)} is not a player!`);
    if (!Number.isInteger(parseInt(args[1], 10)) || Number.parseFloat(args[1]) <= 0) return deleteInvalidCommand(msg, "Invalid donation amount!");
    if (findUserIndex(game, msg.author.id) === -1) return deleteInvalidCommand(msg, "No points to give!");
    if (Number.parseFloat(args[1]) * 1000 > findUserInfo(game, msg.author.id)[1]) return deleteInvalidCommand(msg, "Not enough points to give!");
    if (msg.author.id === recipient.id) return deleteInvalidCommand(msg, "You can't donate to yourself.");
    const donateAmt = parseInt(args[1], 10) * 1000;
    game[findUserIndex(game, msg.author.id)][1] -= donateAmt;
    game[findUserIndex(game, recipient.id)][1] += donateAmt;
    db.set("game_scores", game);

    let donateMsg = new Discord.MessageEmbed()
        .setColor("ORANGE")
        .setTitle("Donation successful!")
        // .setDescription(`${msg.author.username} is very generous!`)
        .addField(`${msg.author.username} -${args[1]}s`, `New score: ${Math.round(findUserInfo(game, msg.author.id)[1] / 1000)}`)
        .addField(`${recipient.username} +${args[1]}s`, `New score: ${Math.round(findUserInfo(game, recipient.id)[1] / 1000)}`)
    msg.channel.send({ embeds: [donateMsg] });
}
exports.name = "donate"
