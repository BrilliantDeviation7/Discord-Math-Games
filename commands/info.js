const Discord = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports.run = async (client, msg, args) => {
    let users = await db.get("user_scores");
    users.sort(function (a, b) {
        if (a[1] === b[1]) return 0;
        return (a[1] < b[1]) ? 1 : -1;
    })

    // rank
    var rank = `${users.length + 1}. `;
    const maxRankLen = rank.length;

    // username
    const usernames = [];
    var maxNameLen = 1;
    for (i = 0; i < users.length; i++) {
        let user = await client.users.fetch(users[i][0]);
        usernames.push(user.username);
        if (user.username.length > maxNameLen) {
            maxNameLen = user.username.length;
        }
    }

    // score
    var score = `${Math.max(...Array.from(users, player => Math.round(player[1] / 1000)))}`;
    const maxScoreLen = score.length;

    var scoresMsg = "```"
    for (j = 0; j < users.length; j++) {
        rank = `${j + 1}. `;
        score = `${Math.round(users[j][1] / 1000)} `;
        scoresMsg += rank + " ".repeat(maxRankLen - rank.length); // rank
        scoresMsg += usernames[j] + " ".repeat(maxNameLen - usernames[j].length + 1); // username
        scoresMsg += score + " ".repeat(maxScoreLen - score.length + 1); // score
        scoresMsg += users[j][2] + "\n"; // reap_count
    }
    let infoMsg = new Discord.MessageEmbed()
        .setColor("LUMINOUS_VIVID_PINK")
        .setTitle("Lifetime Leaderboard")
        .setDescription(scoresMsg + "```")
    msg.channel.send({ embeds: [infoMsg] });
}
exports.name = "info"
