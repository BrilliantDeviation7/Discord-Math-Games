const Database = require("@replit/database");
const db = new Database();
const { deleteInvalidCommand } = require("../tools");

module.exports.run = async (client, msg, args) => {
    if (args.length < 1) {
        return deleteInvalidCommand(msg, "What game are we playing today?");
    }
    const game = args[0].toLowerCase();
    if (game == "reaper") {
        if (msg.author.id != process.env.ADMIN) return deleteInvalidCommand(msg, "Not authorized!");
        let start = await db.get("start_time");
        if (start) return deleteInvalidCommand(msg, "Game already started!");
        startTime = Date.now();
        db.set("start_time", startTime);
        db.set("last_reap", startTime);
        db.set("game_scores", []);
        msg.channel.send(`${msg.author.username} started new game!`);
        msg.delete();

        let user_scores = await db.get("user_scores");
        if (!user_scores) db.set("user_scores", []);
    } else if (game == "greed") {
        return deleteInvalidCommand(msg, "That game is not complete! BDimension7 is currently developing Greed Control.");
    } else {
        return deleteInvalidCommand(msg, "That game is not available!");
    }
}
exports.name = "start"
