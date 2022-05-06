const Discord = require("discord.js");
const Database = require("@replit/database");
const db = new Database();
const cooldown = 3600; // seconds
const nightTax = 0.7; // 30% tax
const {
    deleteInvalidCommand,
    setMultiplier,
    findUserIndex,
    findUserInfo,
    isNight,
    SecondstoTime,
} = require("../tools");

module.exports.run = (client, msg, args) => {
    db.get("last_reap").then((last_reap) => {
        // [username, score, reap_time, reap_count, free_reap]
        db.get("game_scores").then((game) => {
            db.get("user_scores").then((users) => {
                if (!last_reap) return deleteInvalidCommand(msg, "No active game!");

                // add new player to user_scores [username, score, reap_count]
                if (findUserIndex(users, msg.author.username) < 0) users.push([msg.author.username, 0, 0]);
                const t = Date.now();
                const [factor, message] = setMultiplier();
                var time_reaped = (t - last_reap) * factor;
                if (time_reaped > 10000000) time_reaped = Math.sqrt(time_reaped * 1000000);
                if (findUserIndex(game, msg.author.username) < 0) {
                    var desc = `${SecondstoTime(cooldown)} until next reap.`;
                    if (isNight()) desc += "\nBeware the anti-night-reaping measures next time!";
                    game.push([msg.author.username, time_reaped, t, 1, 0]);
                    users[findUserIndex(users, msg.author.username)][1] += time_reaped
                    users[findUserIndex(users, msg.author.username)][2] += 1
                    db.set("last_reap", t);
                    db.set("game_scores", game);
                    db.set("user_scores", users);
                    var color = "AQUA";
                    var title = `You reaped ${Math.round(time_reaped / 1000)} second(s)! ${message}`;
                } else if (t - findUserInfo(game, msg.author.username)[2] > cooldown * 1000) {
                    game[findUserIndex(game, msg.author.username)][2] = t;
                    var desc = `${SecondstoTime(cooldown)} until next reap.`;
                    var color = "AQUA";
                    if (isNight()) {
                        if (!Math.floor(Math.random() * 2)) {
                            game.sort(function (a, b) {
                                if (a[1] == b[1]) return 0;
                                return a[1] < b[1] ? 1 : -1;
                            });
                            if (findUserIndex(game, msg.author.username) == game.length - 1) {
                                color = "DARK_RED";
                                var title = `You burned ${time_reaped / 1000} seconds!`;
                                desc = "**WARNING**\nNight-reaper detection caught you!";
                            } else {
                                color = "GOLD";
                                var title = `You donated ${time_reaped / 1000} seconds to\n${game[findUserIndex(game, msg.author.username) + 1][0]}!`;
                                desc = "**WARNING**\nNight-reaper detection caught you!\nTime donated to player ranked below you.";
                                game[findUserIndex(game, msg.author.username) + 1][1] += time_reaped;
                            }
                        } else {
                            var title = `You reaped ${Math.round((time_reaped / 1000) * nightTax)} second(s)! ${message}`;
                            game[findUserIndex(game, msg.author.username)][1] += time_reaped * nightTax;
                            users[findUserIndex(users, msg.author.username)][1] += time_reaped * nightTax;
                            desc += "\nAnti-night-reaper spared you this time!\n30% night tax applied.";
                        }
                    } else {
                        var title = `You reaped ${Math.round(time_reaped / 1000)} second(s)! ${message}`;
                        game[findUserIndex(game, msg.author.username)][1] += time_reaped;
                        users[findUserIndex(users, msg.author.username)][1] += time_reaped;
                    }
                    game[findUserIndex(game, msg.author.username)][3] += 1;
                    users[findUserIndex(users, msg.author.username)][2] += 1;
                    db.set("last_reap", t);
                    db.set("game_scores", game);
                    db.set("user_scores", users);
                } else {
                    var color = "GREY";
                    var title = "No reap available!";
                    var desc = `${SecondstoTime(Math.round(cooldown - (t - findUserInfo(game, msg.author.username)[2]) / 1000))} until next reap!`;
                }

                let reapMsg = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(title)
                    .setDescription(desc)
                    .setAuthor({
                        name: msg.author.username,
                        iconURL: msg.author.displayAvatarURL(),
                    })
                    .addField("Score:", `${Math.round(findUserInfo(game, msg.author.username)[1] / 1000)} seconds`)
                msg.channel.send({ embeds: [reapMsg] });
                console.log("GAME_SCORES");
                console.log(game);
                console.log("USER_SCORES");
                console.log(users);
            });
        });
    });
};
exports.name = "reap";
