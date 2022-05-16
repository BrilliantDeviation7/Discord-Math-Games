const Database = require("@replit/database");
const db = new Database();
const tools = require("../tools");

module.exports.run = async (client, msg, args) => {
    if (msg.author.id != process.env.ADMIN) return tools.deleteInvalidCommand(msg, "Not authorized!");
    let start = await db.get("start_time");
    if (start) return tools.deleteInvalidCommand(msg, "Game already started!");
    startTime = Date.now();
    db.set("start_time", startTime);
    db.set("last_reap", startTime);
    db.set("game_scores", []);
    msg.channel.send(`${msg.author.username} started new game!`);
    msg.delete();

    let user_scores = await db.get("user_scores");
    if (!user_scores) db.set("user_scores", []);
}
exports.name = "start"
