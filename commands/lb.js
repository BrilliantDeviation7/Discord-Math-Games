const Discord = require("discord.js")
const Database = require("@replit/database")
const db = new Database()
const { deleteInvalidCommand } = require("../tools");

module.exports.run = async (client, msg, args) => {
    let game = await db.get("game_scores");
    if (!game) return deleteInvalidCommand(msg, "No game in progress!");
    if (game.length < 1) return deleteInvalidCommand(msg, "No scores available.");
    game.sort(function (a, b) {
        if (a[1] === b[1]) return 0;
        return (a[1] < b[1]) ? 1 : -1;
    })

    // rank
    var rank = `${game.length + 1}. `;
    const maxRankLen = rank.length;

    // username
    const usernames = [];
    var maxNameLen = 1;
    for (i = 0; i < game.length; i++) {
        let user = await client.users.fetch(game[i][0]);
        usernames.push(user.username);
        if (user.username.length > maxNameLen) {
            maxNameLen = user.username.length;
        }
    }

    // score
    var score = `${Math.max(...Array.from(game, player => Math.round(player[1] / 1000)))}`;
    const maxScoreLen = score.length;

    var scoresMsg = "```"
    for (j = 0; j < game.length; j++) {
        rank = `${j + 1}. `;
        score = `${Math.round(game[j][1] / 1000)} `;
        scoresMsg += rank + " ".repeat(maxRankLen - rank.length); // rank
        scoresMsg += usernames[j] + " ".repeat(maxNameLen - usernames[j].length + 1); // username
        scoresMsg += score + " ".repeat(maxScoreLen - score.length + 1); // score
        scoresMsg += game[j][3] + "\n"; // reap_count
    }
    let leaderboardMsg = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle("Leaderboard")
        .setDescription(scoresMsg + "```")
    msg.channel.send({ embeds: [leaderboardMsg] });
}
exports.name = "lb"
