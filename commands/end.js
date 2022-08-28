const Database = require("@replit/database");
const db = new Database();
const { deleteInvalidCommand } = require("../tools");

module.exports.run = async (client, msg, args) => {
    if (msg.author.id != process.env.ADMIN) return deleteInvalidCommand(msg, "Not authorized!");
    if (args.length < 1) {
        return deleteInvalidCommand(msg, "Which game should be ended?");
    }
    const game = args[0].toLowerCase();
    if (game == "reaper") {
        let start = await db.get("start_time");
        if (!start) return deleteInvalidCommand(msg, "No game in progress!");
        await msg.channel.send(`**${msg.author.username} ended the game!**\nHere is the final leaderboard:`);
        const command = client.commands.get("lb");
        await command.run(client, msg, args);
        db.delete("start_time");
        db.delete("last_reap");
        db.delete("game_scores");
        msg.delete();
    } else if (game == "greed") {
        let greed = await db.get("greed_players");
        if (!greed) return deleteInvalidCommand(msg, "No game in progress!");
        db.delete("greed_players");
    }
}
exports.name = "end"
